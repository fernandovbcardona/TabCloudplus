$(function () {
    Settings.ready.then(function () {
        $('input[name="openin"][value="'+Settings.get('openin', 'window')+'"]').attr('checked','checked');
        $('input[name="deleteconfirm"][value="'+Settings.get('deleteconfirm', 'yes')+'"]').attr('checked','checked');
        $('input[name="encryption"][value="'+Settings.get('encryption', 'no')+'"]').attr('checked','checked');
    });

    $('input[type="radio"]').change(function (e) {
        Settings.set($(this).attr('name'), $(this).attr('value'));
    });

    var LEGACY_ORIGIN = 'https://chrometabcloud.appspot.com/*';

    $('#importlegacy').on('click', function () {
        var $status = $('#importstatus');
        var $btn = $(this);
        $btn.prop('disabled', true);
        $status.text('Requesting permission...');

        chrome.permissions.request({ origins: [LEGACY_ORIGIN] }, function (granted) {
            if (!granted) {
                $status.text('Permission was not granted, nothing was imported.');
                $btn.prop('disabled', false);
                return;
            }

            $status.text('Fetching your old saved windows...');

            fetch('https://chrometabcloud.appspot.com/tabcloud', { credentials: 'include' })
                .then(function (res) { return res.json(); })
                .then(async function (data) {
                    if (data.status !== 'loggedin') {
                        $status.html('You are not logged in to the old account. <a href="https://chrometabcloud.appspot.com/login" target="_blank">Log in here</a>, then try again.');
                        $btn.prop('disabled', false);
                        return;
                    }

                    if (!data.windows || data.windows.length === 0) {
                        $status.text('The old account has no saved windows.');
                        $btn.prop('disabled', false);
                        return;
                    }

                    await SyncStore.ready;

                    var imported = 0;
                    var skipped = 0;
                    // Insert in reverse so the final order matches the original list
                    // (addFront always inserts at position 0).
                    for (var i = data.windows.length - 1; i >= 0; i--) {
                        try {
                            await SyncStore.addFront(data.windows[i]);
                            imported++;
                        } catch (e) {
                            skipped++;
                        }
                    }

                    var message = 'Imported ' + imported + ' window(s).';
                    if (skipped > 0) {
                        message += ' ' + skipped + ' window(s) were too large to sync and were skipped.';
                    }
                    $status.text(message);
                    $btn.prop('disabled', false);
                })
                .catch(function (e) {
                    $status.text('Could not reach the old TabCloud server. Try again later.');
                    $btn.prop('disabled', false);
                });
        });
    });
});
