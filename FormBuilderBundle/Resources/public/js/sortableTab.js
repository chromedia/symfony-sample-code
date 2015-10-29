/**
 * @author Adelbert Silla
 * 
 * Form Builder Sortable Form Tab.
 */

formBuilderApp.service('SortableTab', function() {
        
    var self = this;
    var formSortableTabs = document.getElementById("sortable-tab");

    self.init = function(formSections, updateCallback) {
        
        new Sortable(formSortableTabs, {

            onStart: function(e) {
                angular.element(e.item).find('a').css({cursor: 'grabbing'});                
            },
            
            onEnd: function(e) {
                angular.element(e.item).find('a').css({cursor: 'pointer'});                
            },
            
            onUpdate: function (evt){
                // get new sort order based on indexes
                var newSortedTabIndexes = [];
                var liElements = formSortableTabs.getElementsByTagName('li');

                for (var i=0; i<liElements.length; i++) {
                    newSortedTabIndexes.push(liElements[i].getAttribute('data-index'));
                }

                formSections = self.sortTabs(formSections, newSortedTabIndexes);
                
                updateCallback(formSections);
            }
        });
    };

    self.sortTabs = function(arr, sortArr) 
    {
        var result = [];
        for(var i=0; i<arr.length; i++) {
            arr[sortArr[i]].position = i+1;
            result[i] = arr[sortArr[i]];
        }
        return result;
    };
    
    return self;
});