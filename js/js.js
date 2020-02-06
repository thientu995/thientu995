class Init {
    constructor() {
        this.isPrint = false;
        const self = this;
        const params = new URL(location.href).searchParams;
        if (params.get('print') != null) {
            const size = params.get('print');
            self.Print(size);
        }
        $.ajax({
            url: 'data.json',
            async: true,
            success: function(res) {
                res.forEach(group => {
                    self.SetValueHeader(group);
                    self.SetValueContent(group);
                });
                self.ProcessLoadPage();
            }
        });
    }

    ProcessLoadPage() {
        if (!this.isPrint) {
            setTimeout(function() {
                new SimpleBar(document.getElementById('body'), { autoHide: true, height: 'auto' })
            });
        }

        $('.loader').hide();
        $('.content').fadeIn(1500);
    }

    SetValueContent(group) {
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

    SetValueHeader(group) {
        let objGroup = $('#' + group.Category + ' *[data-attr="Header"]');
        if (objGroup.length == 0) return;
        let contentHtml = objGroup.html();
        contentHtml = contentHtml.replace(new RegExp('{{Icon}}', 'g'), group.Icon);
        contentHtml = contentHtml.replace(new RegExp('{{Text}}', 'g'), group.Text);
        objGroup.html('');
        objGroup.append(contentHtml);
    }

    Print(size) {
        this.isPrint = true;
        size = size || 210;
        $('footer,header').hide();
        $('html').css('width', size + 'mm');
    }
}

$(functioon(){
  new Init();
});
