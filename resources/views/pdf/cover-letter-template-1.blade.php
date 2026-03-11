<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Cover Letter</title>
    <style>
        body { font-family: Arial, Helvetica, sans-serif; color: #222; margin: 0; padding: 0;}
        .container { 
            max-width: 800px; 
            margin: 20px auto; 
            background: #fff url('https://app.enhancv.com/images/16-d32df7bd4064ded28f23.png') no-repeat center top; 
            background-size: cover;
            padding: 36px; 
            border-radius: 6px; 
            box-sizing: border-box; 
            box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.2); 
        }

        .header { border-bottom: 2px solid #6a6a6a; padding-bottom: 10px; margin-bottom: 18px; }
        .name { font-size: 27px; color: #0b63c6; font-weight: 700; font-family: 'Times New Roman', Times, serif; }

        .contact-line {
            font-size: 13px;
            color: #555;
            margin-top: 6px;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
        }

        .contact-info {
            display: inline-flex;
            align-items: center;
            line-height: 1.2;
        }

        .contact-info img {
            width: 14px;
            height: 14px;
            margin-right: 6px;
            display: inline-block;
        }

        .contact-info a {
            color: #0b63c6;
            text-decoration: none;
        }

        .contact-line span.divider {
            color: #aaa;
        }

        .letter {
            font-size: 15px;
            line-height: 1.6;
            color: #333;
            margin-top: 20px;
            width: 100%;
            box-sizing: border-box;
            word-wrap: break-word;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="name">{{ $name ?? (auth()->check() ? auth()->user()->name : null) ?? 'Applicant' }}</div>

            <div class="contact-line">
                @php
                    $parts = [];
                    if(!empty($email)) {
                        $parts[] = '<span class="contact-info"><img src="'.$emailIcon.'" />'.$email.'</span>';
                    }
                    if(!empty($phone)) {
                        $parts[] = '<span class="contact-info"><img src="'.$phoneIcon.'" />'.$phone.'</span>';
                    }
                    if(!empty($linkedin)) {
                        $link = preg_match('#^https?://#i', $linkedin) ? $linkedin : 'https://' . $linkedin;
                        $parts[] = '<span class="contact-info"><img src="'.$linkedinIcon.'" /><a href="'.$link.'">'.$linkedin.'</a></span>';
                    }
                @endphp
                {!! implode('<span class="divider">|</span>', $parts) !!}
            </div>
        </div>

        <!-- Letter content -->
        <div class="letter">
            {!! nl2br($coverLetterHtml) !!}
        </div>
    </div>
</body>
</html>
