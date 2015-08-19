var PDF = "application/pdf";

var Args = {
    URL: "url",
    CONTENT_TYPE: "contentType",
    OPTIONS: "options"
};


cordova.commandProxy.add("SitewaertsDocumentViewer", {
    getSupportInfo: function (successCallback, errorCallback)
    {
        successCallback({supported: [PDF]});
    },
    canViewDocument: function (successCallback, errorCallback, params)
    {
        var no = {status: 0};

        if (!params || params.length != 1)
        {
            successCallback(no);
            return;
        }
        params = params[0];

        var url = params[Args.URL];
        if (!url)
        {
            successCallback(no);
            return;
        }
        // TODO: check availability of url

        var contentType = params[Args.CONTENT_TYPE];
        if (contentType != PDF)
        {
            successCallback(no);
            return;
        }

        successCallback({status: 1}); // YES
    },
    viewDocument: function (successCallback, errorCallback, params)
    {
        if (!params || params.length != 1)
        {
            errorCallback({status: 0, message: "missing arguments"});
            return;
        }

        params = params[0];

        var url = params[Args.URL];
        if (!url)
        {
            errorCallback({status: 0, message: "missing argument url"});
            return;
        }

        var contentType = params[Args.CONTENT_TYPE];
        if (contentType != PDF)
        {
            errorCallback({status: 0, message: "illegal content type "
                    + contentType});
            return;
        }


        var options = params[Args.OPTIONS];

        var currentWindow = window;


        var viewerId = "sitewaertsdocumentviewer_windows";
        var iframeId = viewerId + "_iframe";

        var iframe = document.getElementById(iframeId);
        var viewer = document.getElementById(viewerId);

        if(!iframe)
        {
            viewer = document.createElement("div");
            viewer.id = viewerId;
            viewer.className = "sitewaertsdocumentviewer windows";
            var close = document.createElement("div");
            close.className = "close";
            iframe = document.createElement("iframe");
            iframe.id = iframeId;

            var body = document.getElementsByTagName("body")[0];
            viewer.appendChild(iframe);
            viewer.appendChild(close);
            body.appendChild(viewer);

            close.addEventListener("click", doClose);
        }

        /**
         * @void
         */
        function doClose()
        {
            iframe.src = "";
            viewer.style.display = 'none';
            successCallback({status: 0}); // closed
        }

        function doCloseAsync()
        {
            currentWindow.setTimeout(function ()
            {
                doClose();
            }, 100);
        }

        // current page must be located in www
        // sitewaertsdocumentviewer must be located in www
        iframe.src = "./sitewaertsdocumentviewer/viewer.html";

        iframe.onload = function ()
        {

            // avoid reloading on close
            iframe.onload = null;

            frames[iframeId].window.showPDF(url, options, doCloseAsync);

            viewer.style.display = 'block';

            successCallback({status: 1}); // shown
        };

    },
    install: function (successCallback, errorCallback)
    {
        errorCallback("operation not supported");
    }
});
