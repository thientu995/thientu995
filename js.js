$(document).ready(function () {
    $.ajax({
        url: 'data.json',
        async: true,
        success: function (res) {
            res.forEach(group => {
                let objGroup = $('#' + group.Category);
                let contentHtml = objGroup.html();
                let valueAttr = objGroup.attr('data-attr').split(',');
                objGroup.html('');
                group.Category
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
            });
            $('body').fadeIn(1500);
        }
    });
});

function Print(size) {
    size = size || 210;
    $('footer').hide();
    $('html').css('width', size + 'mm');
}

function PageA4() {
    Print(210);
}