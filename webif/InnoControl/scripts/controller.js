/**
 * Created by Julian on 31.08.2016.
 */

var ctrl = app.controller("InnoController", function ($scope, $http, $mdDialog, $mdToast, $interval, $location) {
    $scope.ipPattern = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
    $scope.macPattern = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
    $scope.admin = "admin";
    $scope.network = {};
    $scope.settings = {};
    $scope.rssvoice = {};
    $scope.rssvoice.vol_dev = [];
    $scope.playlists = [];
    $scope.playlists.vol_dev = [];
    $scope.devices = [];
    $scope.devicestmp = [];
    $scope.uploadfile = undefined;
    $scope.sysinfo = {};
    $scope.networkmount = {};
    $scope.resetcb = {
        usb:false,
        network:false,
        playlists:false
    };


    $scope.formatId = function (id) {
        if (id != 10) {
            id = '0' + id;
        }
        return id;
    };

    $scope.showLmsSwitch = function () {
        $http.get('api/helper.php?lms')
            .success(function (data) {
                if (data == "1") {
                    $scope.lmsCB = 1;
                } else {
                    $scope.lmsCB = 0;
                }
            });
    };

    $scope.changedLmsSwitch = function () {
        $scope.lmsCB = $scope.lmsCB == 1 ? 0 : 1;

        $http.get('api/helper.php?lms_save&value=' + $scope.lmsCB);
    };

    $scope.stop_lms = function () {
        $http.get('subpages/home.php?stop_lms');
        location.reload();
    };

    $scope.start_lms = function () {
        $http.get('subpages/home.php?start_lms');
        location.reload();
    };

    $scope.playlinein = function (idIN, idOUT) {
        idIN = $scope.formatId(idIN);
        idOUT = $scope.formatId(idOUT);

        $http.get('api/helper.php?setlinein&card_in=' + idIN + '&card_out=' + idOUT);
        $scope.selectedDevice.lineinStatus = idIN;
    };

    $scope.stoplinein = function (idOUT) {
        idOUT = $scope.formatId(idOUT);

        $http.get('api/helper.php?setlinein&card_out=' + idOUT);
        $scope.selectedDevice.lineinStatus = null;
    };

    $scope.muteAmp = function (id) {
        $scope.devices[id - 1].vol.linein = 0;
        $scope.devices[id - 1].vol.mpd = 0;
        $scope.devices[id - 1].vol.squeezebox = 0;
        $scope.devices[id - 1].vol.airplay = 0;

        $http.get('api/helper.php?vol_mute&dev=' + $scope.formatId($scope.selectedDevice.id));
    };

    /**
     * Sets the Inputs to disabled if toggled.
     */
    $scope.onChangeDHCP = function () {
        var fields, i;

        if ($scope.network.dhcp == 'dhcp') {
            fields = document.getElementsByClassName("settingsNF");

            for (i = 0; i < fields.length; i++) {
                fields[i].readOnly = true;
                fields[i].style.color = "gray";
            }
        } else {
            fields = document.getElementsByClassName("settingsNF");

            for (i = 0; i < fields.length; i++) {
                fields[i].removeAttribute('readonly');
                fields[i].style.color = "black";
            }
        }
    };

    // Section USB-Mount
    $scope.onChangeUsbMount = function () {
        $scope.usbmount = $scope.usbmount == 1 ? 0 : 1;

        if ($scope.usbmount == 1) {
            $http.get('subpages/settings.php?start_usbmount');
        } else {
            $http.get('subpages/settings.php?stop_usbmount');
        }
    };

    $scope.showUSBSwitch = function () {
        $http.get('api/helper.php?get_usbmount')
            .success(function (data) {
                if (data == 1) {
                    $scope.usbmount = 1;
                } else {
                    $scope.usbmount = 0;
                }
            });
    };

    $scope.setNetworkSettings = function () {
        //noinspection JSUnresolvedFunction,JSValidateTypes
        var confirm = $mdDialog.confirm()
            .title('Bist du sicher?')
            .textContent('Der Server wird neugestartet.')
            .ariaLabel('Der Server ist die Zeit nicht erreichbar!')
            .targetEvent(event)
            .ok('Ok')
            .cancel('Abbrechen');
        $mdDialog.show(confirm).then(function () {
            $http.get('api/helper.php?setnet' +
                '&dhcp=' + $scope.network.dhcp +
                '&ip=' + $scope.network.ip +
                '&subnet=' + $scope.network.subnet +
                '&gate=' + $scope.network.gate +
                '&dns1=' + $scope.network.dns1 +
                '&dns2=' + $scope.network.dns2)
                .success(function () {
                    location.href = "scripts/reboot.php?ip=" + $scope.network.ip + "&dhcp=" + $scope.network.dhcp;
                });

        }, function () {

        });
    };

    /**
     * Selects the device to show on the second card.
     * @param {number} id Sets the clicked device to the selecteddevice.
     */
    $scope.selectDevice = function (id) {
        if (id == null) {
            $scope.selectedDevice = null;
        } else {
          var found = false;
          for (var i = 0; i < $scope.devices.length; i++) {
              if ($scope.devices[i].id == id
                    && $scope.devices[i].betrieb == 'nichtverbunden') {
                      found = true;
                  $scope.selectedDevice = null;
              }
          }
          if (!found) {
            $http.get('api/helper.php?vol&dev=' + $scope.formatId(id))
                .success(function (data) {
                    var arr = data.split(";");
                    if (data != 0) {
                        for (var i = 0; i < $scope.devices.length; i++) {
                            if ($scope.devices[i].id == id) {
                                $scope.devices[i].vol.mpd = parseInt(arr[0]) / 10;
                                $scope.devices[i].vol.squeezebox = parseInt(arr[1]) / 10;
                                $scope.devices[i].vol.airplay = parseInt(arr[2]) / 10;
                                $scope.devices[i].vol.linein = parseInt(arr[3]) / 10;
                            }
                        }
                    }
                });

            $http.get('api/helper.php?lineinstatus&dev=' + $scope.formatId(id))
                .success(function (data) {
                    if (data > 0) {
                        for (var i = 0; i < $scope.devices.length; i++) {
                            if ($scope.devices[i].id == id) {
                                $scope.devices[i].lineinStatus = data;
                            }
                        }
                    }
                });
            for (var i = 0; i < $scope.devices.length; i++) {
                if ($scope.devices[i].id == id) {
                    $scope.selectedDevice = $scope.devices[i];
                }
            }
          }
        }
    };

    /**
     * Changes the Volume in the devices variable and sends it to the server.
     * @param {string} player chooses the player to change volume.
     */
    $scope.changeVol = function (player) {
        var value = 0;
        var id = $scope.formatId($scope.selectedDevice.id);

        switch (player) {
            case 'mpd':
                value = $scope.selectedDevice.vol.mpd * 10;
                break;
            case 'squeeze':
                value = $scope.selectedDevice.vol.squeezebox * 10;
                break;
            case 'airplay':
                value = $scope.selectedDevice.vol.airplay * 10;
                break;
            case 'LineIn':
                value = $scope.selectedDevice.vol.linein * 10;
                break;
        }
        $http.get('api/helper.php?vol_set&dev=' + id + '&player=' + player + '&value=' + value);
    };

    /**
     * Shows the Reboot Toast an REBOOT Button
     */
    $scope.showToast = function () {
        var toast = $mdToast.simple()
            .textContent('Der Server muss neugestartet werden!')
            .action('Reboot')
            .highlightAction(false);
        $mdToast.show(toast).then(function (response) {
            if (response == 'ok') {
                $http.get('api/helper.php?audio_configuration')
                    .success(function (data) {
                        location.href = "scripts/reboot.php";
                    });
            }
        });
    };

    /**
     * Controlls the Reboot dialog.
     * @param {event} event.
     */
    $scope.rebootDialog = function (event) {
        var confirm = $mdDialog.confirm()
            .title('Bist du sicher?')
            .textContent('Der Server wird neugestartet.')
            .ariaLabel('Der Server ist nicht erreichbar!')
            .targetEvent(event)
            .ok('Ok')
            .cancel('Abbrechen');
        $mdDialog.show(confirm).then(function () {
            location.href = "scripts/reboot.php";
        }, function () {

        });
    };

    $scope.resetLogs = function (event) {
      var confirm = $mdDialog.confirm()
          .title('Bist du sicher?')
          .textContent('Alle Logs werden gelöscht!')
          .ariaLabel('Der Server ist die Zeit nicht erreichbar!')
          .targetEvent(event)
          .ok('Ok')
          .cancel('Abbrechen');
      $mdDialog.show(confirm).then(function () {
          $http.get('api/helper.php?reset_usb_mapping')
              .success(function (data) {
                  location.href = "index.php#/docs";
              });
      }, function () {

      });
    };

    $scope.resetMapping = function (event) {
      var confirm = $mdDialog.confirm()
          .title('Bist du sicher?')
          .textContent('Die Gerätereihenfolge kann sich verändern und dadurch alle Zonen beinflussen!')
          .ariaLabel('Der Server ist die Zeit nicht erreichbar!')
          .targetEvent(event)
          .ok('Ok')
          .cancel('Abbrechen');
      $mdDialog.show(confirm).then(function () {
          $http.get('api/helper.php?reset_logs')
              .success(function (data) {
                  location.href = "scripts/reboot.php";
              });
      }, function () {

      });
    };

    $scope.genAudioConf = function (event) {
        var confirm = $mdDialog.confirm()
            .title('Bist du sicher?')
            .textContent('Der Server wird neugestartet.')
            .ariaLabel('Der Server ist die Zeit nicht erreichbar!')
            .targetEvent(event)
            .ok('Ok')
            .cancel('Abbrechen');
        $mdDialog.show(confirm).then(function () {
            $http.get('api/helper.php?audio_configuration')
                .success(function (data) {
                    location.href = "scripts/reboot.php";
                });
        }, function () {

        });
    };


    $scope.genPlayerConf = function (event) {
        var confirm = $mdDialog.confirm()
            .title('Bist du sicher?')
            .textContent('Sind Sie sicher? Media Server & (Sh)Airplay wird neu gestartet, dies kann mehrere Minuten dauern!.')
            .ariaLabel('Der LMS ist kurz nicht erreichbar!')
            .targetEvent(event)
            .ok('Ok')
            .cancel('Abbrechen');
        $mdDialog.show(confirm).then(function () {
            document.getElementById("loadingsymbol").style.display = "block";
            $http.get('api/helper.php?player_configuration')
                .success(function (data) {
                    document.getElementById("loadingsymbol").style.display = "none";
                    $scope.playerConfChanged = 0;
                    var toast = $mdToast.simple()
                        .textContent("Erfolgreich Player Konfiguration erzeugt!")
                        .highlightAction(true);
                    $mdToast.show(toast).then();
                })
        });
    };

    $scope.getNetworkSettings = function () {
        $http.get('api/helper.php?shnet')
            .success(function (data) {
                var arr = data.split(";");
                if (data != 0) {
                    $scope.network.dhcp = arr[0];
                    $scope.network.ip = arr[1];
                    $scope.network.subnet = arr[2];
                    $scope.network.gate = arr[3];
                    $scope.network.mac = arr[4];
                    $scope.network.dns1 = arr[5];
                    $scope.network.dns2 = arr[6];
                }
                $scope.onChangeDHCP();
            });
    };

    $scope.getWebinterfaceSettings = function () {
        $http.get('api/helper.php?web_settings')
            .success(function (data) {
                var arr = data.split(";");
                if (data != 0) {
                    $scope.settings.password = arr[0];
                    $scope.settings.port = parseInt(arr[1]);
                }
            });
    };
    $scope.setWebinterfaceSettings = function () {
        $http.get('api/helper.php?web_settings_set&password=' + $scope.settings.password + '&port=' + $scope.settings.port);
        $http.post('index.php')
            .success(function () {
                location.href = "/login.php";
            });
    };

    $scope.selectPlaylist = function (id) {
        if (id != null) {
            $scope.selectedPlaylist = $scope.playlists[id];
            $scope.getPlaylist(id);
        } else {
            $scope.selectedPlaylist = null;
        }
    };

    $scope.getPlaylists = function () {
        $scope.playlists = [];

        $http.get('api/helper.php?playlists')
            .success(function (data) {
                var arr = data.split(";");
                if (data != 0) {
                    for (var i = 0; i < arr.length - 1; i++) {
                        $scope.playlists.push({id: i, name: arr[i], vol_dev: []});
                    }
                }
            });
    };

    $scope.getPlaylist = function (id) {
        $http.get('api/helper.php?getplaylist&ID=' + id)
            .success(function (data) {
                var arr = data.split(";");
                if (data != 0) {
                    $scope.playlists[id].vol_background = parseInt(arr[0]);
                    $scope.playlists[id].vol_dev = [];
                    for (var i = 1; i < 11; i++) {
                        if (arr[i].indexOf("/")!=-1) {
                            var tmparr = arr[i].split("/");
                            $scope.playlists[id].vol_dev.push({
                                id: i-1,
                                volumeL: parseInt(tmparr[0]),
                                volumeR: parseInt(tmparr[1])
                            })
                        } else {
                            $scope.playlists[id].vol_dev.push({id: i-1, volume: parseInt(arr[i])})
                        }
                    }
                }

                $scope.devices.sort(function(a, b) {
                    return a.id > b.id;
                });
            });
    };

    $scope.deletePlaylist = function (id) {
        $http.get('api/helper.php?deleteplaylist&ID=' + (id + 1));
        $scope.playlists.splice(id, 1);
    };

    $scope.savePlaylist = function (id) {
        var volStr = "";
        for (var i = 0; i < 10; i++) {
            if ($scope.devices[i] != null && $scope.devices[i].betrieb == "geteilterbetrieb") {
                volStr += ("&VOL_DEV" + $scope.formatId(i + 1) + "=" + $scope.playlists[id].vol_dev[i].volumeL + "/" + $scope.playlists[id].vol_dev[i].volumeR);
            } else if ($scope.devices[i] != null && $scope.devices[i].betrieb == "deaktiviert") {
                volStr += ("&VOL_DEV" + $scope.formatId(i + 1) + "=0");
            } else {
                volStr += ("&VOL_DEV" + $scope.formatId(i + 1) + "=" + $scope.playlists[id].vol_dev[i].volume);
            }

        }

        $http.get('api/helper.php?saveplaylist' +
            '&ID=' + (id + 1) +
            '&VOL_BACKGROUND=' + $scope.playlists[id].vol_background + volStr)
            .success(function () {
                $scope.makeToast("Erfolgreich gespeichert!");
                //location.reload();
            });
    };

    $scope.savePlaylistName = function (id) {
        if ($scope.playlists[id].vol_background == undefined) {
            $http.get('api/helper.php?saveplaylist' +
                '&ID=' + (id + 1) +
                '&NAME=' + $scope.playlists[id].name +
                '&VOL_BACKGROUND=-1')

                .success(function (data) {
                    location.reload();
                });
        } else {
            $http.get('api/helper.php?saveplaylist' +
                '&ID=' + (id + 1) +
                '&NAME=' + $scope.playlists[id].name)

                .success(function (data) {
                    location.reload();
                });
        }
    };

    $scope.playPlaylist = function (id) {
        $http.get('api/helper.php?playlistplay' +
            '&ID=' + (id));
    };
    $scope.stopPlaylist = function (id) {
        $http.get('api/helper.php?playliststop' +
            '&ID=' + (id));
    };


    $scope.addPlaylist = function () {
        if($scope.playlists[$scope.playlists.length - 1] == undefined){
            $scope.playlists.push({id: 0, name: ""});
        } else {
            $scope.playlists.push({id: ($scope.playlists[$scope.playlists.length - 1].id + 1), name: ""});
        }
    };

    $scope.setAudioConfiguration = function () {
        var id = $scope.formatId($scope.selectedDevice.id);
        var mode;

        if ($scope.selectedDevice.betrieb == 'normalbetrieb') {
            mode = "1";
        } else if ($scope.selectedDevice.betrieb == 'geteilterbetrieb') {
            mode = "2";
        } else if ($scope.selectedDevice.betrieb == 'deaktiviert') {
            mode = "0";
        }

        $http.get('api/helper.php?set_audio_configuration&dev=' + id + '&mode=' + mode)
            .success(function () {
                $scope.audioConfChanged = 1;
                $scope.showToast();
            });
    };

    $scope.setAudioConfigurationDeactivated = function () {
        var id = $scope.formatId($scope.selectedDevice.id);
        $scope.selectedDevice = null;

        $http.get('api/helper.php?set_audio_configuration&dev=' + id + '&mode=' + 0)
            .success(function () {
                $scope.audioConfChanged = 1;
                $scope.showToast();
            });

        $scope.getDevices();
    };

    $scope.setLinkConfiguration = function () {
        var id = $scope.formatId($scope.selectedDevice.id);
        var linkedid = 10+ parseInt($scope.formatId($scope.selectedDevice.linktoDevice));


        $http.get('api/helper.php?set_audio_configuration&dev=' + id + '&mode=' + linkedid)
         .success(function () {
                $scope.audioConfChanged = 1;
                $scope.showToast();
            });

        $scope.getDevices();
    };

    $scope.checkAirplay = function (airplayString) {
        if (airplayString == 0 || airplayString == undefined) {
            return "";
        } else if (airplayString == 1) {
            return "AP" + $scope.formatId($scope.selectedDevice.id);
        }
    };
    $scope.checkSpotify = function (spotifyString) {
        if (spotifyString == 0 || spotifyString == undefined) {
            return "";
        } else if (spotifyString == 1) {
            return "SP" + $scope.formatId($scope.selectedDevice.id);
        }
    };

    $scope.saveDevice = function () {
        $scope.selectedDevice.changed = false;
        var id = $scope.formatId($scope.selectedDevice.id);

        if ($scope.selectedDevice.betrieb == 'normalbetrieb') {
            $http.get('api/helper.php?device_set&dev=' + id +
                '&NAME_NORMAL=' + $scope.selectedDevice.name +
                '&MAC_NORMAL=' + $scope.selectedDevice.mac +
                '&AP_NORMAL=' + $scope.checkAirplay($scope.selectedDevice.airplay) +
                '&SP_NORMAL=' + $scope.checkSpotify($scope.selectedDevice.spotify) +
                '&oac=' + $scope.selectedDevice.oac);
            $scope.playerConfChanged = 1;
            console.log($scope.selectedDevice);

        } else if ($scope.selectedDevice.betrieb == 'geteilterbetrieb') {
            $http.get('api/helper.php?device_set&dev=' + id +
                '&NAMEli_GETEILT=' + $scope.selectedDevice.nameL +
                '&NAMEre_GETEILT=' + $scope.selectedDevice.nameR +
                '&MACli_GETEILT=' + $scope.selectedDevice.macL +
                '&MACre_GETEILT=' + $scope.selectedDevice.macR +
                '&APli_GETEILT=' + $scope.checkAirplay($scope.selectedDevice.airplayL) +
                '&APre_GETEILT=' + $scope.checkAirplay($scope.selectedDevice.airplayR) +
                '&SPli_GETEILT=' + $scope.checkSpotify($scope.selectedDevice.spotifyL) +
                '&SPre_GETEILT=' + $scope.checkSpotify($scope.selectedDevice.spotifyR) +
                '&oac=' + $scope.selectedDevice.oac);
            $scope.playerConfChanged = 1;
        }

    };

    $scope.getDevices = function () {
        $http.get('api/helper.php?activedevices')
            .success(function (data) {
                var arr = data.split(";");
                $scope.devicestmp = [];
                for (var i = 0; i < arr.length; i++) {
                    (function (e) {
                        const tmp_id = (i + 1);
                        if (arr[i] == 1) {
                            $http.get('api/helper.php?getdevice&dev=' + $scope.formatId(tmp_id))
                                .success(function (data) {
                                    var dev = data.split(";");
                                    if (dev[0] == 1) {
                                        $betrieb = "normalbetrieb";
                                        $airplayString = 0;
                                        if (dev[7].startsWith("AP")) {
                                            $airplayString = 1;
                                        } else {
                                            $airplayString = 0;
                                        }

                                        $spotifyString = 0;
                                        if (dev[10].startsWith("SP")) {
                                            $spotifyString = 1;
                                        } else {
                                            $spotifyString = 0;
                                        }

                                        $scope.devicestmp.push({
                                            id: tmp_id,
                                            betrieb: $betrieb,
                                            name: dev[1],
                                            mac: dev[4],
                                            airplay: $airplayString,
                                            spotify: $spotifyString,
                                            vol: {},
                                            oac: parseInt(dev[15])
                                        });
                                    } else if (dev[0] == 2) {
                                        $betrieb = "geteilterbetrieb";

                                        $airplayStringL = 0;
                                        if (dev[8].startsWith("AP")) {
                                            $airplayStringL = 1;
                                        } else {
                                            $airplayStringL = 0;
                                        }

                                        $airplayStringR = 0;
                                        if (dev[9].startsWith("AP")) {
                                            $airplayStringR = 1;
                                        } else {
                                            $airplayStringR = 0;
                                        }

                                        $spotifyStringL = 0;
                                        if (dev[11].startsWith("SP")) {
                                            $spotifyStringL = 1;
                                        } else {
                                            $spotifyStringL = 0;
                                        }

                                        $spotifyStringR = 0;
                                        if (dev[12].startsWith("SP")) {
                                            $spotifyStringR = 1;
                                        } else {
                                            $spotifyStringR = 0;
                                        }

                                        $scope.devicestmp.push({
                                            id: tmp_id,
                                            betrieb: $betrieb,
                                            nameL: dev[2],
                                            nameR: dev[3],
                                            macL: dev[5],
                                            macR: dev[6],
                                            airplayL: $airplayStringL,
                                            airplayR: $airplayStringR,
                                            spotifyL: $spotifyStringL,
                                            spotifyR: $spotifyStringR,
                                            vol: {},
                                            oac: parseInt(dev[15])
                                        });
                                    } else if(parseInt(dev[0]) > 10 && parseInt(dev[0]) <= 20){
                                        $betrieb = "gekoppelt";
                                        $scope.devicestmp.push({id: tmp_id, betrieb: $betrieb, linktoDevice: parseInt(dev[0])-10, vol: {}});
                                    }else {
                                        $betrieb = "deaktiviert";
                                        $scope.devicestmp.push({id: tmp_id, betrieb: $betrieb, vol: {}});
                                    }

                                    $scope.devicestmp.sort(function(a, b) {
                                        return a.id > b.id;
                                    });

                                    if ($scope.devicestmp !== $scope.devices) {
                                        $scope.devices = $scope.devicestmp;
                                    }
                                });
                        }
                    })(i);
                }
            });

        $http.get('api/helper.php?getchangedconf')
            .success(function (data) {
                var arr = data.split(";");
                $scope.audioConfChanged = arr[0] == 1;

                $scope.playerConfChanged = arr[1] == 1;

            });

    };
    $scope.getVoiceRssKey = function () {
        $http.get('api/helper.php?getvoicersskey')
            .success(function (data) {
                var arr = data.split(";");
                if (data != 0 && arr[0] != "none") {
                    $scope.rssvoice.key = arr[0];
                }
            });

    };

    $scope.saveRssVoiceKey = function (key) {
        if (key == "none") {
            $http.get('api/helper.php?setvoicersskey&value=none');
            $scope.rssvoice = {};
            $scope.getVoiceRssKey();
        } else {
            $http.get('api/helper.php?setvoicersskey&value=' + $scope.rssvoice.tmpkey);
            $scope.rssvoice.key = $scope.rssvoice.tmpkey;
        }
    };

    $scope.getSysInfo = function () {
        $http.get('api/helper.php?getsysinfo')
            .success(function (data) {
                var arr = data.split(";");
                if (data != 0 && arr[0] != "none") {
                    $scope.sysinfo.cpu = arr[0];
                    $scope.sysinfo.ram = arr[1];
                    if (!arr[2].indexOf(":")!=-1) {
                        $scope.sysinfo.uptime = arr[2] + " min";
                    } else if (arr[2].length > 3 && arr[2].length < 6) {
                        $scope.sysinfo.uptime = arr[2] + " h";
                    } else if (arr[2].charAt(0) == "1") {
                        $scope.sysinfo.uptime = arr[2] + " Tag";
                    } else {
                        $scope.sysinfo.uptime = arr[2] + " Tage";
                    }

                    $scope.sysinfo.disksize = arr[3];
                    $scope.sysinfo.diskspace = arr[4];
                    $scope.sysinfo.diskpercent = arr[5];
                    $scope.sysinfo.cputemp = arr[6];
                }
            });
    };

    $scope.formatSizeUnits = function (kilobytes) {
        if (kilobytes >= 1048576) {
            kilobytes = (kilobytes / 1048576).toFixed(2) + ' GB';
        }
        else if (kilobytes >= 1024) {
            kilobytes = (kilobytes / 1024).toFixed(2) + ' MB';
        }
        else if (kilobytes > 1) {
            kilobytes = kilobytes + ' KB';
        }
        else if (kilobytes == 1) {
            kilobytes = kilobytes + ' KB';
        }
        else {
            kilobytes = '0 byte';
        }
        return kilobytes;
    };

    $scope.isfileuploaded = function () {
        if ($location.search().result != undefined) {
            var toast = $mdToast.simple()
                .textContent('Upload ' + $location.search().result + '!')
                .highlightAction(true);
            $mdToast.show(toast).then();
        }
    };

    $scope.getVoiceoutputVol = function () {
        $http.get('api/helper.php?getvoiceoutputvol')
            .success(function (data) {
                var arr = data.split(";");
                if (data != 0) {
                    $scope.rssvoice.vol_background = parseInt(arr[0]);

                    $scope.rssvoice.vol_dev = [];

                    for (var i = 0; i < $scope.devices.length; i++) {
                        if (arr[i + 1].indexOf("/") != -1) {
                            var tmparr = arr[i + 1].split("/");
                            $scope.rssvoice.vol_dev.push({
                                id: i,
                                volumeL: parseInt(tmparr[0]),
                                volumeR: parseInt(tmparr[1])
                            })
                        } else {
                            $scope.rssvoice.vol_dev.push({id: i, volume: parseInt(arr[i + 1])})
                        }
                    }
                }
            });
        $scope.devices.sort(function(a, b) {
            return a.id > b.id;
        });
    };

    $scope.saveVoiceoutputVol = function () {
        var volStr = "";
        for (var i = 0; i < $scope.rssvoice.vol_dev.length; i++) {
            if ($scope.devices[i].betrieb == "normalbetrieb") {
                volStr += ("&VOL_DEV" + $scope.formatId(i + 1) + "=" + $scope.rssvoice.vol_dev[i].volume);
            } else if ($scope.devices[i].betrieb == "geteilterbetrieb") {
                volStr += ("&VOL_DEV" + $scope.formatId(i + 1) + "=" + $scope.rssvoice.vol_dev[i].volumeL + "/" + $scope.rssvoice.vol_dev[i].volumeR);
            } else if ($scope.devices[i].betrieb == "deaktiviert") {
                volStr += ("&VOL_DEV" + $scope.formatId(i + 1) + "=0");
            }
        }

        $http.get('api/helper.php?setvoiceoutputvol' +
            '&VOL_BACKGROUND=' + $scope.rssvoice.vol_background + volStr)
            .success(function (data) {
                $scope.makeToast("Erfolgreich gespeichert!");
                //location.reload();
            });
    };

    $scope.makeToast = function (text) {
        var toast = $mdToast.simple()
            .textContent(text)
            .highlightAction(true);
        $mdToast.show(toast).then();
    };

    $scope.update = function () {
        var update = $mdDialog.confirm()
            .title('Bist du sicher?')
            .textContent('Update auf neue Version! Der Server wird neu gestartet, dies kann mehrere Minuten dauern!.')
            .ariaLabel('Update!')
            .targetEvent(event)
            .ok('Ok')
            .cancel('Abbrechen');
        $mdDialog.show(update).then(function () {
            document.getElementById("loadingsymbol").style.display = "block";

            $http.get('api/helper.php?update').success(function () {
                location.href = "/scripts/reboot.php?update=true"
            });
        });
    };

    $scope.saveNetworkMount = function () {
        if($scope.options == undefined){
            $scope.options = "";
        }
        $http.get('api/helper.php?savenetworkmount' +
            '&path='+$scope.networkmount.path +
            '&mountpoint='+$scope.networkmount.mountpoint +
            '&type='+$scope.networkmount.type +
            '&options='+$scope.networkmount.options)
            .success(function () {
                console.log('api/helper.php?savenetworkmount' +
                    '&path='+$scope.networkmount.path +
                    '&mountpoint='+$scope.networkmount.mountpoint +
                    '&type='+$scope.networkmount.type +
                    '&options='+$scope.networkmount.options);
        });
    };

    $scope.getNetworkMount = function () {
        $http.get('api/helper.php?getnetworkmount')
            .success(function (data) {
                $scope.networkmount.list = data;
            });

    };


    $scope.reset = function () {
        //noinspection JSUnresolvedFunction,JSValidateTypes
        var confirm = $mdDialog.confirm()
            .title('Bist du sicher?')
            .textContent('Die Konfiguration wird zurückgesetzt.')
            .ariaLabel('Der Server ist die Zeit nicht erreichbar!')
            .targetEvent(event)
            .ok('Ok')
            .cancel('Abbrechen');
        $mdDialog.show(confirm).then(function () {
            var resetstr = "";


            if($scope.resetcb.network == true){
                resetstr += "&network";
            }
            if($scope.resetcb.usb == true){
                resetstr += "&usb";
            }
            if($scope.resetcb.playlists == true){
                resetstr += "&playlists"
            }
            $http.get('api/helper.php?reset'+resetstr)
                .success(function (data) {

                    if(data.indexOf("network")!=-1){
                        location.href = "scripts/reboot.php?dhcp=dhcp";
                    }else {
                        location.href = "scripts/reboot.php";
                    }
                });

        }, function () {

        });
    };

    //Interval für System Info
    $interval($scope.getSysInfo, 4000);
    $scope.getDevices();
});

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}