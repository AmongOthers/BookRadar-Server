AutoCompleter = function(acdivid,objid,url)
{
       this._resultdiv = $(acdivid);
       this._obj = $(objid);
       this._objvalue = '';
       if (!this._obj) return false;
       this._currentindex = -1;
       this._url = url;
       this._sendurl;
       this._sendparams;
       this._lastlength = 0; /*用来处理中文*/
       this._timeout;
       this._delay = 400;
       this._resultindex = 0;
       var pointer = this;
       this._obj.onkeyup = function(e){return pointer.onKeyUp(e); }
       Event.observe(this._obj,"blur",function(){setTimeout(pointer.hideResultDiv.bind(pointer), 200)},false);
       this.setResultDivPos();
       this.hideResultDiv();
       return this;
}

AutoCompleter.prototype = 
{
    visible : function()
    {
         return $(this._resultdiv).style.display != 'none';
    }
    ,
    hideResultDiv : function()
    {
          this._currentindex = -1;
          this._lastlength = 0;
          $(this._resultdiv).hide(); 
    }
    ,
    showResultDiv : function()
    {
        this._currentindex = -1;
        var pointer = this;
        var childobj = null;
        var childobjindex = 0;
        if (this.getSize() > 0)
        {
            while ((childobj = $(this._resultdiv).down(this._resultindex).down(childobjindex)) != null)
            {
                $(childobj).index = childobjindex;
                $(childobj).onmouseover = function(){pointer.doMouseOver.bind(pointer);pointer.doMouseOver(this);}
                $(childobj).onmouseout = function(){pointer.doMouseOut.bind(pointer);pointer.doMouseOut(this);}
                $(childobj).onclick = function(){pointer.doMouseClick.bind(pointer);pointer.doMouseClick(this);}
                childobjindex++;   
            }
        }
        $(this._resultdiv).show();
    }
    ,
    setResultDivPos : function()
    {
        var offsets = Position.positionedOffset($(this._obj));
        var top = offsets[1];
        var left = offsets[0];
        var width = $(this._obj).clientWidth;
        var height = $(this._obj).clientHeight;
        this._resultdiv.style.top = top + height + 3 + "px";
        this._resultdiv.style.left = left + 1 + "px";
        this._resultdiv.style.width = parseInt($(this._obj).style.width) + 4 + "px";
        //this._resultdiv.style.height = "100px";
    }
    ,
    onKeyUp : function(e)
    {
        e = (window.event) ? window.event : e;
        var keycode =  (e.keyCode) ? e.keyCode : e.which;
        if (keycode == 27 || keycode == 38 || keycode == 40 || keycode == 13 || keycode == 9)
        {
//            if (e.preventDefault)
//                e.preventDefault();
//			if (e.stopPropagation)
//                e.stopPropagation();
//			e.cancelBubble = true;
//			e.returnValue = false;
            Event.stop(e);
			switch(keycode) 
			{
	
	                case 27: //	escape
						this.hideResultDiv();
						break;
					case 38: // up
						this.preResult();
						break;
			
					case 40: // down
						this.nextResult();
						break;
					case 9:  // tab
					case 13: // return
						this.selectResult();
						break;
			}
			
        }
        else
        {
            this._objvalue = this._obj.value;
            if (this._objvalue == '')
            {
                if (this._timeout) 
                    clearTimeout(this._timeout);
                this._lastlength = this._objvalue.length;
                return;
            }
            if (this._objvalue.length != this._lastlength)
            {
                if (this._timeout) 
                    clearTimeout(this._timeout);
				this._timeout = setTimeout(this.getSuggestion.bind(this),this._delay);
			    this._lastlength = this._objvalue.length;
            }
        }
    }
    ,
    doMouseOver : function(idxobj)
    {
        this.clearSelected();
        $(idxobj).className = 'selected';
        this._currentindex = idxobj.index;
    }
    ,
    doMouseOut : function(idxobj)
    {
        $(idxobj).className = '';
    }
    ,
    doMouseClick : function(idxobj)
    {
        $(this._obj).value = $(idxobj).innerHTML.toHtmlDecode();
        this.hideResultDiv();
    }
    ,
    getSize : function()
    {
        if ($(this._resultdiv).down(this._resultindex) == undefined)
        {
            return 0;
        }
        return $(this._resultdiv).down(this._resultindex).childNodes.length;
    }
    ,
    getNode : function(idx)
    {
        if (idx < 0 || idx >this.getSize() - 1)
            return null;
        return $(this._resultdiv).down(this._resultindex).down(idx);
    }
    ,
    clearSelected : function()
    {
       var node = this.getNode(this._currentindex)
       if (node != null)
            $(node).className = "";
    }
    ,
    changeResult : function(oidx,nidx)
    {
        var onode = this.getNode(oidx);
        var nnode = this.getNode(nidx);
        if (onode != null)
        {
            $(onode).className = "";
        }
        if (nnode != null)
        {
            $(nnode).className = "selected";
            $(this._obj).value = getInnerText($(nnode));
        }
        else
            $(this._obj).value = this._objvalue;
    }
    ,
    preResult : function()
    {
        if (!this.getSize())
            return;
        var oci = this._currentindex;
        this._currentindex -= 1;
        if (this._currentindex <= -1)
            this._currentindex = this.getSize();
        this.changeResult(oci,this._currentindex);
    }
    ,
    nextResult : function()
    {
        if (!this.getSize())
            return;
        var oci = this._currentindex;
        this._currentindex += 1;
        if (this._currentindex > this.getSize() - 1)
            this._currentindex = -1;
        this.changeResult(oci,this._currentindex);
        
    }
    ,
    selectResult : function()
    {
        this.hideResultDiv();
    }
    ,
    getSuggestion : function()
    {
          this.initializeUrl();
          var sendurl = this._sendurl;
          var sendparams = this._sendparams;
          var suggestionAjax = new Ajax.Request(
            sendurl,
            {
                method:'get',
                parameters:sendparams,
                onSuccess: this.showSuggestionResponse.bind(this)
            }
        );  
    }
    ,
    initializeUrl : function()
    {
        var urlParts = this._url.split("?");
        this._sendurl = urlParts[0];
        if (urlParts[1])
        {
            this._sendparams = urlParts[1];
            this._sendparams += '&s=' + encodeURIComponent(this._objvalue);//使用了encodeURIComponent后输入%再也不会出现“被解码的url不是合法的编码”错误
        }
        else
        {
            this._sendparams = 's=' + encodeURIComponent(this._objvalue);
        }
        this_sendparams = encodeURI(this._sendparams);
    }
    ,
    showSuggestionResponse : function(response)
    {
        var result = response.responseText;
        this.displaySuggestion(result).bind(this);
        
    }
    ,
    displaySuggestion : function(txt)
    {
        if (txt.length == 0)
        {
            this.hideResultDiv();
            return;
        }
        if (isie())
        {
            var frametxt = "<iframe src=\"javascript:\" style=\"position:absolute;left:0px;top:0px; visibility:inherit;z-index:-1; filter='progid:DXImageTransform.Microsoft.Alpha(style=0,opacity=0)';\"></iframe>";
            $(this._resultdiv).innerHTML = frametxt + txt;
            this._resultindex = 1;
        }else
        {
            $(this._resultdiv).innerHTML = txt;
            this._resultindex = 0;
        }
        this.showResultDiv();
    }
}


