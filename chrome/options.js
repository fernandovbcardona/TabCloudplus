$(function () {
    Settings.ready.then(function () {
        $('input[name="openin"][value="'+Settings.get('openin', 'window')+'"]').attr('checked','checked');
        $('input[name="deleteconfirm"][value="'+Settings.get('deleteconfirm', 'yes')+'"]').attr('checked','checked');
        $('input[name="encryption"][value="'+Settings.get('encryption', 'no')+'"]').attr('checked','checked');
    });

    $('input[type="radio"]').change(function (e) {
        Settings.set($(this).attr('name'), $(this).attr('value'));
    });
});
