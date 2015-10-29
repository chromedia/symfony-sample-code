/**
 * Parse dependents configuration to javascript.
 * 
 * @author Adelbert Silla
 */
var DependencyConfigParser = function(parentElem, config) {
    
    var self = this;

    self.formQuestionIdPrefix = 'formQuestion_';
    self.dependentClassMapperPrefix = 'form-question-dependent-to-';
    self.dependentClassMapper = '';

    self.parentElem = parentElem;
    self.dependentsConfig = config;

    self.getParentElemId = function() {
        return self.parentElem.attr('id');
    };

    self.apply = function() {
        self.dependentClassMapper = self.dependentClassMapperPrefix + self.getParentElemId();

        self.initDependentChildren();

        self.applyDependentsBehavior();
    };

    self.initDependentChildren = function() {
        var config = self.dependentsConfig;

        // hide all children and add class mapper. 
        for(i in config) {
        
            if(!config[i] || typeof config[i].dependents == 'undefined' || !config[i].dependents) {
                continue;
            }
            
            for(dependentId in config[i].dependents) {
                console.log('addClass to element: ' + '#' + self.formQuestionIdPrefix + dependentId);
                $('#' + self.formQuestionIdPrefix + dependentId)
                    .addClass(self.dependentClassMapper)
                    .hide().prev('.assistance').hide();
            }
        }
    };

    self.applyDependentsBehavior = function() {
        // case radio only
        var currentValue = false;
        self.parentElem.find('input[type=radio]').click(function(){

            // Hide all dependents questions with
            $('.' + self.dependentClassMapper).slideUp().each(function(){
                $(this).prev('.assistance').slideUp();
            });

            // FIXME: Temporary approached to unselect radio button.
            if(currentValue === $(this).val()) {
                currentValue = false;
                $(this).removeAttr('checked');
                return;
            } else {
                currentValue = $(this).val();
                $(this).attr('checked');
            }
            
            var $parent = $(this).parents('.form-question:first');
            var value = $('input[type=radio]:checked', $parent).val();
            if(typeof value != 'undefined') {

                // Get dependents configuration based on selected value
                var eachConfig = config[value];
                if(typeof eachConfig == 'undefined') {
                    eachConfig = config[value.toString().toLowerCase()];
                }

                if(typeof eachConfig == 'undefined' || !eachConfig || typeof eachConfig.dependents == 'undefined') {
                    return;
                }

                // Show the dependent questions
                for(i in eachConfig.dependents) {
                    console.log(self.formQuestionIdPrefix + i);
                    console.log($('#' + self.formQuestionIdPrefix + i));
                    $('#' + self.formQuestionIdPrefix + i).slideDown()
                        .css('display', $('#' + self.formQuestionIdPrefix + i).data('default-display'))
                        .prev('.assistance').slideDown();
                }
            }

        });

        self.parentElem.find('input[type=radio]:checked').click();

        // case input field

    };

    return self;
};
