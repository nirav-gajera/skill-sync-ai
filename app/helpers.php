<?php

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

if (! function_exists('storageDiskName')) {
    function storageDiskName(): string
    {
        return (string) config('filesystems.default', 'public');
    }
}

if (! function_exists('storageFileUrl')) {
    function storageFileUrl(?string $filePath): ?string
    {
        if (! $filePath) {
            return null;
        }

        $diskName = storageDiskName();
        $diskConfig = config("filesystems.disks.{$diskName}", []);
        $driver = $diskConfig['driver'] ?? '';

        if ($driver === 's3') {
            $expirationMinutes = (int) env('FILESYSTEM_TEMP_URL_EXPIRATION', 5);
            $expiration = now()->addMinutes($expirationMinutes);

            /** @var \Illuminate\Filesystem\AwsS3V3Adapter $disk */
            $disk = Storage::disk($diskName);

            return $disk->temporaryUrl($filePath, $expiration);
        }

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk($diskName);

        return $disk->url($filePath);
    }
}

if (! function_exists('withStoredFile')) {
    function withStoredFile(string $filePath, callable $callback): mixed
    {
        $diskName = storageDiskName();
        $diskConfig = config("filesystems.disks.{$diskName}", []);
        $disk = Storage::disk($diskName);

        if (($diskConfig['driver'] ?? null) === 'local') {
            return $callback($disk->path($filePath));
        }

        $sourceStream = $disk->readStream($filePath);

        if ($sourceStream === false) {
            throw new RuntimeException("Unable to read file [{$filePath}] from disk [{$diskName}].");
        }

        $tempPath = tempnam(sys_get_temp_dir(), 'storage_');

        if ($tempPath === false) {
            if (is_resource($sourceStream)) {
                fclose($sourceStream);
            }

            throw new RuntimeException('Unable to create a temporary file.');
        }

        $extension = pathinfo($filePath, PATHINFO_EXTENSION);

        if ($extension !== '') {
            $renamedTempPath = $tempPath.'.'.$extension;
            rename($tempPath, $renamedTempPath);
            $tempPath = $renamedTempPath;
        }

        $tempStream = fopen($tempPath, 'wb');

        if ($tempStream === false) {
            if (is_resource($sourceStream)) {
                fclose($sourceStream);
            }

            @unlink($tempPath);

            throw new RuntimeException("Unable to open temporary file [{$tempPath}] for writing.");
        }

        try {
            stream_copy_to_stream($sourceStream, $tempStream);

            return $callback($tempPath);
        } finally {
            if (is_resource($sourceStream)) {
                fclose($sourceStream);
            }

            if (is_resource($tempStream)) {
                fclose($tempStream);
            }

            @unlink($tempPath);
        }
    }
}

if (! function_exists('extractResumeContent')) {
    function extractResumeContent(string $filePath): string
    {
        Log::info('Extracting resume', ['file' => $filePath]);

        if (! file_exists($filePath)) {
            Log::error('Resume file not found', ['file' => $filePath]);
            throw new \Exception("Resume file not found at {$filePath}");
        }

        $content = '';
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

        try {
            switch ($ext) {
                case 'txt':
                case 'json':
                case 'xml':
                    $content = file_get_contents($filePath);
                    break;

                case 'pdf':
                    $parser = new \Smalot\PdfParser\Parser;
                    $pdf = $parser->parseFile($filePath);
                    $content = $pdf->getText();
                    break;

                case 'docx':
                case 'doc':
                    $reader = ($ext === 'docx') ? 'Word2007' : 'MsDoc';
                    $phpWord = \PhpOffice\PhpWord\IOFactory::load($filePath, $reader);
                    foreach ($phpWord->getSections() as $section) {
                        foreach ($section->getElements() as $element) {
                            if (method_exists($element, 'getText')) {
                                $content .= $element->getText()."\n";
                            } elseif (method_exists($element, 'getElements')) {
                                foreach ($element->getElements() as $child) {
                                    if (method_exists($child, 'getText')) {
                                        $content .= $child->getText()."\n";
                                    }
                                }
                            }
                        }
                    }
                    break;

                default:
                    throw new \Exception("Unsupported file type: {$ext}");
            }

            // Normalize encoding
            $detected = mb_detect_encoding($content, 'UTF-8, ISO-8859-1, Windows-1252', true);
            $content = mb_convert_encoding($content, 'UTF-8', $detected ?: 'UTF-8');
            $content = preg_replace('/[^\PC\s]/u', '', $content);

            Log::info('Resume content extracted', ['length' => strlen($content)]);

            return trim($content);
        } catch (\Exception $e) {
            Log::error('Error extracting content', [
                'file' => $filePath,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}

if (! function_exists('coverLetterTemplateView')) {
    /**
     * Get the Blade view path for a given cover letter template ID.
     */
    function coverLetterTemplateView(int $templateId = 0): string
    {
        return match ($templateId) {
            1 => 'pdf.cover-letter-template-1',
            2 => 'pdf.cover-letter-template-2',
            3 => 'pdf.cover-letter-template-3',

            default => 'pdf.cover-letter-template',
        };
    }
}
