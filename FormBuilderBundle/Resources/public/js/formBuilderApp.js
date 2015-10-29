/**
 * @author Adelbert Silla
 * 
 * FormBuilder Application Initialization.
 */

var formBuilderApp = angular.module('formBuilderApp', ['restangular', 'ui.tinymce', 'ngDialog', 'ui.bootstrap'])
    .value('apiDefaultRequestParams', Session.getSecurityAccessUrlParameters());

formBuilderApp.config(function(RestangularProvider) {
    RestangularProvider.setBaseUrl(UrlHelper.getApiBaseUrl()+'/');
    RestangularProvider.addResponseInterceptor(function(data, operation, what, url, response, deferred) {
        return typeof(data.data) != 'undefined' ? data.data : data;
    });

    RestangularProvider.setErrorInterceptor(function(response, deferred, responseHandler) {
        if(response.status === 403) {
            alert("We've been idle for a bit too long. Your changes may not have saved. Click refresh please.");
            window.location.reload();

            return false; // error handled
        }

        return true; // error not handled
    });
});

// TODO: Improve process
formBuilderApp.directive('widgetElement', function($compile) {
    
    var directiveDefinitionObject = {
        link: function postLink(scope, iElement, iAttrs) {
            var elem = angular.element(scope.each.widgetElem);
            var widgetMetadata = scope.each.formElement.widgetMetadata;

            if(typeof scope.each.formQuestion == 'undefined') {
                if(typeof widgetMetadata.name != 'undefined' && (widgetMetadata.name == 'header' || widgetMetadata.name == 'paragraph') ) {
                    elem.attr('ng-bind', 'each.formElement.text');
                }
            }

            if((elem.prop('tagName') == 'INPUT' && elem.prop('type') == 'text') || elem.prop('tagName') == 'TEXTAREA') {
                elem.attr('ng-model', 'each.formQuestion.example');
                elem.attr('ng-blur', 'updateFormQuestion($event, each)');
                elem.attr('ng-class', '{noplaceholder:!each.formElement.renderConfig.display_example}');
            }

            if(widgetMetadata.widget_id == 'date_picker') {
                elem = $('<datepicker ng-model="each.formQuestion.example" show-weeks="true" class="well well-sm"></datepicker>');
            }

            iElement.html(elem);
            $compile(iElement.contents())(scope);
        }
    };

    return directiveDefinitionObject;

});

formBuilderApp.filter('inArray', function() {
    return function(array, value) {
        return array.indexOf(value) !== -1;
    };
});