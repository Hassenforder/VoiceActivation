/*! 
 * jQuery Bootgrid v1.3.1 - 09/11/2015
 * Copyright (c) 2014-2015 Rafael Staib (http://www.jquery-bootgrid.com)
 * Licensed under MIT http://www.opensource.org/licenses/MIT
 * Modified by al_hunter@fws.gov for Bootstrap 4
 */
;(function ($, window, undefined)
{
    "use strict";

    $.extend($.fn.bootgrid.Constructor.defaults.css, {
        icon: "icon fas",
        iconColumns: "fa-th-list",
        iconDown: "fa-sort-down",
        iconRefresh: "fa-sync-alt",
        iconSearch: "fa-search",
        iconUp: "fa-sort-up",
        paginationButton: "page-link"
    });

    $.extend($.fn.bootgrid.Constructor.defaults.templates, {
        actionButton: "<button class=\"btn btn-outline-secondary\" type=\"button\" title=\"{{ctx.text}}\">{{ctx.content}}<span class=\"obscure\">{{ctx.text}}</span></button>",
        actionDropDown: "<div class=\"{{css.dropDownMenu}}\"><button class=\"btn btn-outline-secondary dropdown-toggle\" type=\"button\" data-toggle=\"dropdown\"><span class=\"{{css.dropDownMenuText}}\">{{ctx.content}}</span> <span class=\"caret\"></span><span class=\"obscure\">Action Dropdown</span></button><ul class=\"{{css.dropDownMenuItems}}\" role=\"menu\"></ul></div>",
        paginationItem: "<li class=\"paginate_button page-item {{ctx.css}}\"><a data-page=\"{{ctx.page}}\" class=\"{{css.paginationButton}}\">{{ctx.text}}</a></li>",
        search: "<label><span class=\"obscure\">Search</span><nobr><button class=\"btn btn-outline-secondary\" disabled type=\"button\"><i class=\"fas fa-search\"><p class=\"sr-only\">Search icon</p></i></button><div class=\"{{css.search}}\"><input type=\"text\" class=\"{{css.searchField}}\" placeholder=\"{{lbl.search}}\" /></div></nobr></label>",
    });
})(jQuery, window);