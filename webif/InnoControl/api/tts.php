﻿<?php
// Variablen definieren

$VOL_BACK = trim  ($_GET["vol_back"]);
$VOL_ALL = trim ($_GET["vol_all"]);
$VOL_01 = trim ($_GET["vol_01"]);
$VOL_02 = trim ($_GET["vol_02"]);
$VOL_03 = trim ($_GET["vol_03"]);
$VOL_04 = trim ($_GET["vol_04"]);
$VOL_05 = trim ($_GET["vol_05"]);
$VOL_06 = trim ($_GET["vol_06"]);
$VOL_07 = trim ($_GET["vol_07"]);
$VOL_08 = trim ($_GET["vol_08"]);
$VOL_09 = trim ($_GET["vol_09"]);
$VOL_10 = trim ($_GET["vol_10"]);

           if ($VOL_ALL != "" ) {
                         if ($VOL_01 == "" ) {
                         $VOL_01 = trim ($_GET["vol_all"]);
                         }
                         if ($VOL_02 == "" ) {
                         $VOL_02 = trim ($_GET["vol_all"]);
                         }
                         if ($VOL_03 == "" ) {
                         $VOL_03 = trim ($_GET["vol_all"]);
                         }
                         if ($VOL_04 == "" ) {
                         $VOL_04 = trim ($_GET["vol_all"]);
                         }
                         if ($VOL_05 == "" ) {
                         $VOL_05 = trim ($_GET["vol_all"]);
                         }
                         if ($VOL_06 == "" ) {
                         $VOL_06 = trim ($_GET["vol_all"]);
                         }
                         if ($VOL_07 == "" ) {
                         $VOL_07 = trim ($_GET["vol_all"]);
                         }
                         if ($VOL_08 == "" ) {
                         $VOL_08 = trim ($_GET["vol_all"]);
                         }
                         if ($VOL_09 == "" ) {
                         $VOL_09 = trim ($_GET["vol_all"]);
                         }
                         if ($VOL_10 == "" ) {
                         $VOL_10 = trim ($_GET["vol_all"]);
                         }
            }

// Volume einlesen
$datei = "/opt/innotune/settings/voiceoutput/voiceoutputvol.txt"; // Name der Datei
$array_vol = file($datei); // Datei in ein Array einlesen
$array_vol=array_map('trim',$array_vol); //Array Trimmen

// Zeile 1   >> Vol. Hintergrund              $array_vol[0]
// Zeile 2   >> Vol. Ausgabe 01               $array_vol[1]
// usw.

           $array = file("/opt/innotune/settings/voiceoutput/voiceoutputvol.txt"); // Datei in ein Array einlesen
           if ($VOL_BACK != "" && $VOL_BACK != $array_vol[0]) {
           array_splice($array, 0, 1, "$VOL_BACK"."\n");
           echo "Derzeit Hintergrundlautstärke: <b>" . $array_vol[0] . "</b><br>";
           echo "Schreibe Hintergrundlautstärke: <b>" . $VOL_BACK . "</b><br>";
             }
           if ($VOL_01 != "" && $VOL_01 != $array_vol[1]){
           array_splice($array, 1, 1, "$VOL_01"."\n");
           echo "Derzeit InnoAMP01 Lautstärke : <b>" . $array_vol[1] . "</b><br>";
           echo "Schreibe InnoAMP01 Lautstärke: <b>" . $VOL_01 . "</b><br>";
             }
           if ($VOL_02 != "" && $VOL_02 != $array_vol[2]){
           array_splice($array, 2, 1, "$VOL_02"."\n");
           echo "Derzeit InnoAMP02 Lautstärke : <b>" . $array_vol[2] . "</b><br>";
           echo "Schreibe InnoAMP02 Lautstärke: <b>" . $VOL_02 . "</b><br>";
             }
           if ($VOL_03 != "" && $VOL_03 != $array_vol[3]){
           array_splice($array, 3, 1, "$VOL_03"."\n");
           echo "Derzeit InnoAMP03 Lautstärke : <b>" . $array_vol[3] . "</b><br>";
           echo "Schreibe InnoAMP03 Lautstärke: <b>" . $VOL_03 . "</b><br>";
             }
           if ($VOL_04 != "" && $VOL_04 != $array_vol[4]){
           array_splice($array, 4, 1, "$VOL_04"."\n");
           echo "Derzeit InnoAMP04 Lautstärke : <b>" . $array_vol[4] . "</b><br>";
           echo "Schreibe InnoAMP04 Lautstärke: <b>" . $VOL_04 . "</b><br>";
             }
           if ($VOL_05 != "" && $VOL_05 != $array_vol[5]){
           array_splice($array, 5, 1, "$VOL_05"."\n");
           echo "Derzeit InnoAMP05 Lautstärke : <b>" . $array_vol[5] . "</b><br>";
           echo "Schreibe InnoAMP05 Lautstärke: <b>" . $VOL_05 . "</b><br>";
             }
           if ($VOL_06 != "" && $VOL_06 != $array_vol[6]){
           array_splice($array, 6, 1, "$VOL_06"."\n");
           echo "Derzeit InnoAMP06 Lautstärke : <b>" . $array_vol[6] . "</b><br>";
           echo "Schreibe InnoAMP06 Lautstärke: <b>" . $VOL_06 . "</b><br>";
             }
           if ($VOL_07 != "" && $VOL_07 != $array_vol[7]){
           array_splice($array, 7, 1, "$VOL_07"."\n");
           echo "Derzeit InnoAMP07 Lautstärke : <b>" . $array_vol[7] . "</b><br>";
           echo "Schreibe InnoAMP07 Lautstärke: <b>" . $VOL_07 . "</b><br>";
             }
           if ($VOL_08 != "" && $VOL_08 != $array_vol[8]){
           array_splice($array, 8, 1, "$VOL_08"."\n");
           echo "Derzeit InnoAMP08 Lautstärke : <b>" . $array_vol[8] . "</b><br>";
           echo "Schreibe InnoAMP08 Lautstärke: <b>" . $VOL_08 . "</b><br>";
             }
           if ($VOL_09 != "" && $VOL_09 != $array_vol[9]){
           array_splice($array, 9, 1, "$VOL_09"."\n");
           echo "Derzeit InnoAMP09 Lautstärke : <b>" . $array_vol[9] . "</b><br>";
           echo "Schreibe InnoAMP09 Lautstärke: <b>" . $VOL_09 . "</b><br>";
             }
           if ($VOL_10 != "" && $VOL_10 != $array_vol[10]){
           array_splice($array, 10, 1, "$VOL_AMP10"."\n");
           echo "Derzeit InnoAMP10 Lautstärke : <b>" . $array_vol[10] . "</b><br>";
           echo "Schreibe InnoAMP10 Lautstärke: <b>" . $VOL_10 . "</b><br>";
             }
           $string = implode("", $array);
           file_put_contents("/opt/innotune/settings/voiceoutput/voiceoutputvol.txt", $string);




$datei = "/opt/innotune/settings/voiceoutput/voicersskey.txt"; // Name der Datei
$array_config = file($datei); // Datei in ein Array einlesen

$key = $array_config[0];
$q = "22khz_16bit_stereo"; // Andere Einstellungen siehe VoiceRSS Doku

$gain = ($_GET["gain"]);
$lang = ($_GET["lang"]);

if ($gain == "") {
    $gain = "100";
}

if ($lang == "") {
    $lang = "de-de"; // Andere Einstellungen siehe VoiceRSS Doku (en-us / en-gb)
}

// Prüfen ob noch ein Prozess läuft
$pids = shell_exec("ps aux | grep -i 'mpg321' | grep -v grep");

if (empty($pids)) {

	// Uhrzeit ausgeben
    $TIME = ($_GET["time"]);

	    // Text anpassen
    $words = rawurldecode($_GET['text']);
    if ($TIME != "" ) {
	    $Stunde = date("H"); 
        $Minute = date("i");
                   if ($Minute == "00" ) {
                         $words = "Es ist". $Stunde. "Uhr.";
                         }		
                   if ($Minute == "01" ) {
                         $words = "Es ist". $Stunde. "Uhr und eine Minute.";
                         }
                   else {
                         $words = "Es ist". $Stunde. "Uhr und". $Minute. "Minuten.";
                        }
    }

    echo "Text to Speech Input: <b>" . $words . "</b><br>";

    //Umlaute konvertieren
    $umlaute = Array("/ä/","/ö/","/ü/","/Ä/","/Ö/","/Ü/","/ß/");
    $replace = Array("ae","oe","ue","Ae","Oe","Ue","ss");
    $words_neu = preg_replace($umlaute, $replace, $words);

    // Parameter VoiceRSS
    $encodedwords = urlencode($words);
    $inlay = "key=$key&hl=$lang&src=$encodedwords&f=$q"; // Variablen Key, Sprache, Text und Qualität definieren
    echo "Parameter VoiceRSS: <b>" . $inlay . "</b><br>";

    // Speicherort der MP3 Datei
    $file = "/media/Soundfiles/tts/" . str_replace(" ", "_", $words_neu) . ".mp3";
    $file = str_replace("ä", "ae", $file);

    // Prüfen ob die MP3 Datei bereits vorhanden ist
    if (!file_exists($file)) {
        $mp3 = file_get_contents('http://api.voicerss.org/?' . $inlay); // HTTPS ist auch möglich
        file_put_contents($file, $mp3);
    }

    echo "Script Aufruf: /var/www/src/ttsvolplay " . str_replace(" ", "_", $words_neu);
    echo "<br>Speicherort: " . $file;

    //Update MPD Library
    shell_exec("mpc update");
    //Execute ttsvolplay
    shell_exec("sudo /var/www/sudoscript.sh ttsvolplay " . str_replace(" ", "_", $words_neu));
} else {
    echo "Fehler!";
}
?>

