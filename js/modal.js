(function ($) {
    var pl = /\+/g, searchStrict = /([^&=]+)=+([^&]*)/g, searchTolerant = /([^&=]+)=?([^&]*)/g, decode = function (s) {
            return decodeURIComponent(s.replace(pl, ' '));
        };
    $.parseQuery = function (query, options) {
        var match, o = {}, opts = options || {}, search = opts.tolerant ? searchTolerant : searchStrict;
        if ('?' === query.substring(0, 1)) {
            query = query.substring(1);
        }
        while (match = search.exec(query)) {
            if (window.CP.shouldStopExecution(1)) {
                break;
            }
            o[decode(match[1])] = decode(match[2]);
        }
        window.CP.exitedLoop(1);
        return o;
    };
    $.getQuery = function (options) {
        return $.parseQuery(window.location.search, options);
    };
    $.fn.parseQuery = function (options) {
        return $.parseQuery($(this).serialize(), options);
    };
}(jQuery));
$(document).ready(function () {
    $('a[href^="http://www.youtube.com"]').on('click', function (e) {
        var queryString = $(this).attr('href').slice($(this).attr('href').indexOf('?') + 1);
        var queryVars = $.parseQuery(queryString);
        if ('v' in queryVars) {
            e.preventDefault();
            var vidWidth = 560;
            var vidHeight = 315;
            if ($(this).attr('data-width')) {
                vidWidth = parseInt($(this).attr('data-width'));
            }
            if ($(this).attr('data-height')) {
                vidHeight = parseInt($(this).attr('data-height'));
            }
            var iFrameCode = '<iframe width="' + vidWidth + '" height="' + vidHeight + '" scrolling="no" allowtransparency="true" allowfullscreen="true" src="http://www.youtube.com/embed/' + queryVars['v'] + '?rel=0&wmode=transparent&showinfo=0" frameborder="0"></iframe>';
            $('#mediaModal .modal-body').html(iFrameCode);
            $('#mediaModal').on('show.bs.modal', function () {
                var modalBody = $(this).find('.modal-body');
                var modalDialog = $(this).find('.modal-dialog');
                var newModalWidth = vidWidth + parseInt(modalBody.css('padding-left')) + parseInt(modalBody.css('padding-right'));
                newModalWidth += parseInt(modalDialog.css('padding-left')) + parseInt(modalDialog.css('padding-right'));
                newModalWidth += 'px';
                $(this).find('.modal-dialog').css('width', newModalWidth);
            });
            $('#mediaModal').modal();
        }
    });
    $('#mediaModal').on('hidden.bs.modal', function () {
        $('#mediaModal .modal-body').html('');
    });
});