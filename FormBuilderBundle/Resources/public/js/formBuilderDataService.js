/**
 * @author Adelbert Silla
 * 
 * Form Builder Application DataService.
 */

formBuilderApp.service('FormBuilderDataService', function() {
        
    var self = this;
    
    self.buildFormProperties = function(formElements) {

        var formProperties = [], formProperty, formQuestion;

        for(var i =0;  i < formElements.length; i++) {

            formElements[i].form = formElements[i].form.id;
            formElements[i].formSection = formElements[i].formSection.id;
            formElements[i].renderConfig = JSON.parse(formElements[i].renderConfig);
            
            formQuestion = null;

            // If has formQuestion property
            if(typeof formElements[i].formQuestion != 'undefined') {
                formQuestion = formElements[i].formQuestion;
                formElements[i].formQuestion = formElements[i].formQuestion.id;
            }
            
            formProperty = this.buildFormPropertyData(formElements[i], formQuestion);
            formProperties.push(formProperty);
        }

        return formProperties;
    },

    self.buildElementProperty = function(elementData, formId, formSection, position) {
        var formElement = this.buildFormElementFromElement(elementData, formId, formSection.id, position);

        return this.buildFormPropertyData(formElement, null);
    },

    self.buildQuestionProperty = function(questionTemplate, formId, formSection, position) {

        var formQuestion = this.buildFormQuestion(questionTemplate, formId);
        var formElement = this.buildFormElementFromQuestion(formQuestion, formSection.id, position, questionTemplate.widgetMetadata);

        return this.buildFormPropertyData(formElement, formQuestion);
    },
    
    self.buildFormPropertyData = function(formElement, formQuestion){

        // Parse string metadata to JSON
        if(typeof formElement.widgetMetadata != 'object') {
            formElement.widgetMetadata = JSON.parse(formElement.widgetMetadata);
        }

        var formProperty = { tab: formElement.formSection, formElement: formElement, relatedFormQuestions: [], counter: 0 };

        if(formQuestion) {
            formProperty.formQuestion = formQuestion;
            formProperty.widgetElem = CWFB_HtmlWidgetFactory.buildFromJSON(formElement.widgetMetadata).el;
        } else {
            formProperty.widgetElem = $(formElement.widgetMetadata.widgetElem);
        }

        return formProperty;
    },

    self.buildFormQuestion = function(questionTemplate, formId) {
        var formQuestion = {
            name: questionTemplate.name,
            example: questionTemplate.example,
            notes: questionTemplate.notes,
            helpText: questionTemplate.helpText,
            question: questionTemplate.question,
            questionTemplate: questionTemplate.id,
            subLabel: questionTemplate.subLabel,
            formQuestionChoices: questionTemplate.formQuestionChoices,
            form: formId,
        };

        return formQuestion;
    },
    
    self.buildFormElementFromQuestion = function(formQuestion, formSectionId, position, widgetMetadata) { 
        var formElement = {
            form: formQuestion.form,
            formSection: formSectionId,
            elementType: 1,
            text: formQuestion.question, 
            //parentFormElement: null,
            position: position,
            renderConfig: CFB_CONFIG.default_render_config,
            widgetMetadata: widgetMetadata,
            isHiddenToMember: 0,
            isLocked: 0
        };

        return formElement;
    };
    
    self.buildFormElementFromElement = function(elementData, formId, formSectionId, position) { 
        var formElement = {
            form: formId,
            formSection: formSectionId,
            elementType: 2,
            text: elementData.label, 
            position: position,
            renderConfig: {
                render_as: CFB_CONFIG.default_render_config.render_as, 
                widget_size: CFB_CONFIG.default_render_config.widget_size
            },
            widgetMetadata: elementData,
        };

        return formElement;
    };
    
    return self;
});