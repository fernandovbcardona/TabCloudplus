$(function () {
    Settings.ready.then(function () {
        $('input[name="openin"][value="'+Settings.get('openin', 'window')+'"]').attr('checked','checked');
        $('input[name="deleteconfirm"][value="'+Settings.get('deleteconfirm', 'yes')+'"]').attr('checked','checked');
        $('input[name="encryption"][value="'+Settings.get('encryption', 'no')+'"]').attr('checked','checked');
    });

    $('input[type="radio"]').change(function (e) {
        Settings.set($(this).attr('name'), $(this).attr('value'));
    });

    $('#importlegacy').on('click', function () {
        var $status = $('#importstatus');
        var $btn = $(this);
        $btn.prop('disabled', true);
        $status.text('Requesting permission...');

        LegacyImport.requestPermission().then(function (granted) {
            if (!granted) {
                $status.text('Permission was not granted, nothing was imported.');
                $btn.prop('disabled', false);
                return;
            }

            $status.text('Fetching your old saved windows...');

            return LegacyImport.fetchLegacyWindows().then(async function (data) {
                if (data.status === 'error') {
                    $status.text('Could not reach the old TabCloud server. Try again later.');
                    $btn.prop('disabled', false);
                    return;
                }

                if (data.status !== 'loggedin') {
                    $status.html('You are not logged in to the old account. <a href="' + LegacyImport.LOGIN_URL + '" target="_blank">Log in here</a>, then try again.');
                    $btn.prop('disabled', false);
                    return;
                }

                if (!data.windows || data.windows.length === 0) {
                    $status.text('The old account has no saved windows.');
                    $btn.prop('disabled', false);
                    return;
                }

                var result = await LegacyImport.importAll(data.windows);
                var message = 'Imported ' + result.imported + ' window(s).';
                if (result.skipped > 0) {
                    message += ' ' + result.skipped + ' window(s) were too large to sync and were skipped.';
                }
                $status.text(message);
                $btn.prop('disabled', false);
            });
        }).catch(function () {
            $status.text('Something went wrong. Try again later.');
            $btn.prop('disabled', false);
        });
    });
});
