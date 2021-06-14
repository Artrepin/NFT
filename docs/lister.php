<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Список страниц</title>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, maximum-scale=1">
    <link rel="stylesheet" href="https://copyl.ru/lister.css">
</head>
<body>
    <?php
    	$files = scandir('.');
    	$i=1;
        $folder = 'projects';
        $path = pathinfo(__FILE__);
        $path['dirname'] = str_replace("", "http://", $path['dirname'] );
        //$path['dirname'] = str_replace("public_html/", "", $path['dirname'] );
    	foreach ($files as $file) {
    		if (preg_match_all('/(.*?)\.html/',$file,$q)) {
                $page_content = file_get_contents ($path['dirname'].'/'.$file.'');
                preg_match_all( "|<title>(.*)</title>|sUSi", $page_content, $titles);
    			echo '<div><a href="'.$file.'" target="_blank">'.$titles[1][0].' <small>'.$file.'</small> <span> '.$i.'</span></a></div>';
    			$i++;
    		}
    	}
    ?>
</body>
</html>
