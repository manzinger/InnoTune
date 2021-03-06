<div ng-init="getVoiceRssKey()" class="demo-card-wide mdl-card mdl-shadow--2dp mdl-cell mdl-cell--8-col mdl-cell--top">
    <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">Sprachausgabe</h2>
    </div>
    <div class="mdl-card__supporting-text" ng-if="!rssvoice.key">
        <!--Under Construction-->
        InnoTune nutzt den Dienst <b>VoiceRss.</b> Um diesen Dienst nutzen zu können braucht man einen API-Key.<br> <a
                href="http://www.voicerss.org/personel/" target="_blank"> Hier anmelden</a>, Schlüssel kopierern und
        einfach in das Feld
        einfügen. <br><br> InnoTune Key: <b>d382c915b3364e0aae5fcce8e03bd60a</b>
        <br><br>
        <md-input-container class="md-block mdl-cell">
            <label id="voicersskeylabel" for="voicerssinput" style="font-size: larger">VoiceRss-Key:</label>
            <input id="voicerssinput" name="voicersskey" ng-model="rssvoice.tmpkey" type="text"
                   aria-label="voicersskey">
        </md-input-container>

    </div>
    <div class="mdl-card__supporting-text" ng-if="rssvoice.key">
        <p>Bis zu 350 Aufrufe pro Tag mit einem Key möglich. Falls mehr benötigt werden rechts ändern drücken! </p><br>
        <br>
        <h5>Beispiel Loxone Virtueller Ausgang:</h5>
        <br>
        <md-input-container class="md-block mdl-cell">
            <label id="textlabel" for="text" style="font-size: larger">Text:</label>
            <input id="text" name="test" ng-model="texttts" type="text" aria-label="textlabel">
        </md-input-container>
            <center>
                <b><a id="copyElement" target="_blank"
                      href="http://<?php echo $_SERVER['SERVER_ADDR'] ?>/api/tts.php?text={{texttts}}">
                        <?php echo $_SERVER['SERVER_ADDR'] ?>
                        /api/tts.php?text={{texttts}}
                    </a></b>
            </center>
        <button class="mdl-button mdl-js-button mdl-button--fab" onclick="copy()">
            <i class="material-icons">content_copy</i>
        </button>
        <b>Kopieren</b>
    </div>
    <div class="mdl-card__menu mdl-cell--hide-phone" ng-if="rssvoice.key">
        VoiceRss-Key: <b>{{rssvoice.key}}</b><br>
        <a href ng-click="saveRssVoiceKey('none')">Ändern?</a>
    </div>
    <div class="mdl-card__actions mdl-card--border">
        <button ng-if="!rssvoice.key" ng-click="saveRssVoiceKey()"
                class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
            Bestätigen
        </button>
        <a href="http://www.voicerss.org/" target="_blank" ng-if="rssvoice.key"
           class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
            VoiceRss
        </a>
    </div>
</div>
<div ng-init="getVoiceoutputVol()"
     class="demo-card-wide mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col mdl-cell--top">
    <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">Lautstärke der Sprachausgabe</h2>
    </div>
    <div class="mdl-card__supporting-text">
        <div class="mdl-grid">
            <md-input-container class="md-block playlstvol mdl-cell--12-col">
                <label id="background">Hintergrundmusik</label>
                <input aria-label="background" type="number" step="any" name="background"
                       ng-model="rssvoice.vol_background" min="0" max="100">
            </md-input-container>
        </div>
        <voiceoutput></voiceoutput>
    </div>
    <div class="mdl-card__actions mdl-card--border">
        <div>
            <button ng-click="saveVoiceoutputVol()"
                    class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
                Speichern
            </button>
        </div>
    </div>
</div>

<div class="demo-card-wide mdl-card mdl-shadow--2dp mdl-cell mdl-cell--12-col">
    <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">API Text to Speech:</h2>
    </div>
    <div class="mdl-card__supporting-text">
        <table>
            <tr>
                <td><b>Hintergrund-50%; Zone01-50%; alle anderen Zonen Mute:</b></td>
                <td style="padding:0 50px 0 50px;"></td>
                <td><?php echo $_SERVER['SERVER_ADDR'] ?>/api/tts.php?text=test&vol_back=50&vol_01=50&vol_all=0</td>
            </tr>
            <tr>
                <td><b>Lautstärke Zone01 50:</b></td>
                <td></td>
                <td><?php echo $_SERVER['SERVER_ADDR'] ?>/api/tts.php?text=test&vol_01=50</td>
            </tr>
            <tr>
                <td><b>Lautstärke Zone01 links 50% rechts Mute (0%):</b></td>
                <td></td>
                <td><?php echo $_SERVER['SERVER_ADDR'] ?>/api/tts.php?text=test&vol_01=50/0</td>
            </tr>
            <tr>
                <td><b>Lautstärke Zone01 50 alle anderen Zonen Mute:</b></td>
                <td></td>
                <td><?php echo $_SERVER['SERVER_ADDR'] ?>/api/tts.php?text=test&vol_01=50&vol_all=0</td>
            </tr>
            <tr>
                <td><b>Lautstärke aller Zonen auf maximum:</b></td>
                <td></td>
                <td><?php echo $_SERVER['SERVER_ADDR'] ?>/api/tts.php?text=test&vol_all=100</td>
            </tr>
            <tr>
                <td><b>Ausgabe Uhrzeit:</b></td>
                <td></td>
                <td><?php echo $_SERVER['SERVER_ADDR'] ?>/api/tts.php?time=1</td>
            </tr>
            <tr>
              <td><b>Nur Ausgeben wenn Kanal frei ist:</b></td>
              <td></td>
              <td><?php echo $_SERVER['SERVER_ADDR'] ?>/api/tts.php?text=test&noqueue</td>
            </tr>
            <tr>
              <td><b>Geschwindigkeit der Sprachausgabe (-10 bis 0):</b></td>
              <td></td>
              <td><?php echo $_SERVER['SERVER_ADDR'] ?>/api/tts.php?text=test&speed=-3</td>
            </tr>
            <tr>
              <td><b>Ausgabe an Squeezeboxlautstärke anpassen:</b></td>
              <td></td>
              <td><?php echo $_SERVER['SERVER_ADDR'] ?>/api/tts.php?text=test&vol_01=squeeze&mac_01=00:00:00:00:00:01</td>
            </tr>
            <tr>
                <td><b>Lautstärke Zone01 links Squeeze rechts Mute (0%):</b></td>
                <td></td>
                <td><?php echo $_SERVER['SERVER_ADDR'] ?>/api/tts.php?text=test&vol_01=squeeze/0&mac_01=00:00:00:00:00:01</td>
            </tr>
            <tr>
                <td><b>Wenn bei geteilten Betrieb nur eine Lautstärke angegeben wird, erfolgt die Ausgabe auf beiden Lautsprechern!</b></td>
            </tr>
        </table>
    </div>
</div>



<script>
    //function to copy to clipboard
    function copy() {
        // create temp element
        var copyElement = document.createElement("span");
        copyElement.appendChild(document.createTextNode(document.getElementById("copyElement").getAttribute("href")));
        copyElement.id = 'tempCopyToClipboard';
        angular.element(document.body.append(copyElement));

        // select the text
        var range = document.createRange();
        range.selectNode(copyElement);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);

        // copy & cleanup
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
        copyElement.remove();

        angular.element(document.getElementById('InnoController')).scope().makeToast('URL kopiert!');
    }
</script>
