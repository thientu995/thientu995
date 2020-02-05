$(document).ready(function () {
    const params = new URL(location.href).searchParams;
    if (params.get('print') != null) {
        let size = params.get('print');
        Print(size);
    }
    $.ajax({
        url: 'data.json',
        async: true,
        success: function (res) {
            res.forEach(group => {
                SetValueHeader(group);
                SetValueContent(group);
            });
            $('body').fadeIn(1500);
        }
    });

    //Function
    function SetValueContent(group) {
        let objGroup = $('#' + group.Category + ' *[data-content!=""]');
        objGroup = objGroup.filter('[data-content]');

        if (objGroup.attr('data-content') == null) return;

        let contentHtml = objGroup.html();
        let valueAttr = objGroup.attr('data-content').split(',');
        objGroup.html('');
        group.Data.forEach(data => {
            let htmlObj = contentHtml;
            valueAttr.forEach(attr => {
                let re = new RegExp('{{' + attr + '}}', 'g');
                if (Array.isArray(data[attr])) {
                    data[attr] = data[attr].join('');
                }
                htmlObj = htmlObj.replace(re, data[attr]);
            });
            objGroup.append(htmlObj);
        });
    }


    function SetValueHeader(group) {
        let objGroup = $('#' + group.Category + ' *[data-attr="Header"]');
        if (objGroup.length == 0) return;
        let contentHtml = objGroup.html();
        contentHtml = contentHtml.replace(new RegExp('{{Icon}}', 'g'), group.Icon);
        contentHtml = contentHtml.replace(new RegExp('{{Text}}', 'g'), group.Text);
        objGroup.html('');
        objGroup.append(contentHtml);
    }
});

function Print(size) {
    size = size || 210;
    $('footer,header').hide();
    $('html').css('width', size + 'mm');
}

function PageA4() {
    Print(210);
}