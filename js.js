$(document).ready(function () {
    $.ajax({
        url: 'data.json',
        async: true,
        success: function (res) {
            console.log(res)
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
                        htmlObj = htmlObj.replace(re, data[attr]);
                    });
                    objGroup.append(htmlObj);
                });
            });
        }
    });
});