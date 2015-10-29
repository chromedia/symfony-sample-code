<?php
namespace YPKY\FormBuilderBundle\Services;

use Symfony\Component\Form\FormFactory as CoreFormFactory;
use Symfony\Component\Form\FormBuilderInterface;
use Doctrine\Bundle\DoctrineBundle\Registry;
use Chromedia\WidgetFormBuilderBundle\Service\FieldTypeFactory;

use YPKY\ProductBundle\Entity\Form;
use YPKY\ProductBundle\Entity\FormQuestion;
use YPKY\ProductBundle\Entity\FormElement;
use YPKY\ProductBundle\Entity\FormSection;
use YPKY\HelperBundle\Classes\StringHelper;
use YPKY\MemberBundle\Entity\MemberForm;
use Symfony\Component\Security\Core\SecurityContext;
use YPKY\MemberBundle\Entity\MemberFormAnswer;
use YPKY\MemberBundle\Entity\Member;
use YPKY\FormBuilderBundle\Form\CustomFormElementType;


class FormProductFactory
{
    protected static $questionsAnswers = array();
    
    protected static $globalQuestionsAnswers = array();
    
    const GLOBAL_FIELD_CLASS = 'global-field';
    const FIELD_SEPARATOR = ':';
    //@todo get this at product.yml
    private $usStateTemplateName;
    

    /**
     * @var CoreFormFactory
     */
    private $coreFormFactory;

    /**
     * @var FieldTypeFactory
     */
    private $fieldTypeFactory;

    /**
     * @var Registry
     */
    private $doctrine;
    
    /**
     * @var FormElementRenderConfigParser
     */
    private $renderConfigParser;
    
    /** 
     * @var SecurityContext 
     */
    private $securityContext;
    
    /** 
     * @param Member $member;
     */
    private $member;


    /**
     * number label for each form widget
     */
    private $numberLabel;

    private $isStateComplianceForm ;
    private static $stateComplianceFormElement = 0;

    /**
     * form widget default array
     */
    private $formWidgetDefaultConstraints = array();
    /**
     * Set SecurityContext $securityContext and Member $member
     *  
     * @param SecurityContext $securityContext
     */
    function setSecurityContext(SecurityContext $securityContext)
    {
        $this->securityContext = $securityContext;

        $member = $this->securityContext->getToken()->getUser()->getUser()->getMember();

        if($member)
            $this->setMember($member);        
    }

    public function setMember(Member $member)
    {
        $this->member = $member;
    }

    public function setDoctrine(Registry $doctrine)
    {
        $this->doctrine = $doctrine;
    }

    public function setFieldTypeFactory(FieldTypeFactory $v)
    {
        $this->fieldTypeFactory = $v;
    }

    public function setCoreFormFactory(CoreFormFactory $v)
    {
        $this->coreFormFactory = $v;
    }
    
    public function setRenderConfigParser(FormElementRenderConfigParser $renderConfigParser)
    {
        $this->renderConfigParser = $renderConfigParser;
    }

    public function setFormWidgetDefaultConstraints($formWidgetDefaultConstraints = array())
    {
        $this->formWidgetDefaultConstraints = $formWidgetDefaultConstraints;
    }

    public function setUsStateTemplateName($questionTemplateNames)
    {
        $this->usStateTemplateName = $questionTemplateNames['organization_profile']['mailing_address']['org_us_state'];
    }
    /**
     *
     * @param Form $formEntity
     * @param FormSection $page
     * @param array $formOptions
     * @return \Symfony\Component\Form\Form
     */
    public function createForm(Form $formEntity, FormSection $page=null, array $formOptions=array())
    {
        // Set static::$questionsAnswers and static::$globalQuestionsAnswers
        $this->setFormQuestionsAnswers($formEntity);
       
        $this->isStateComplianceForm($formEntity);

        var_dump($formOptions);
        
        $builder = $this->coreFormFactory->createBuilder('form', null, $formOptions);
var_dump($builder);
exit;
        // get form elements of this form
        $formElements = $this->doctrine->getRepository('ProductBundle:FormElement')
            ->findByForm($formEntity, $page);

        $this->numberLabel = 1;
        foreach ($formElements as $each) {
            $this->add($builder, $each);
        }

        return $builder->getForm();
    }
    
    private function setFormQuestionsAnswers($formEntity)
    {
        $criteria = array('member' => $this->member, 'form' => $formEntity);
        $memeberForm = $this->doctrine->getRepository('MemberBundle:MemberForm')->findOneBy($criteria);
        
        // Set Form Answers
        if($memeberForm) {
            $answers = $memeberForm->getMemberFormAnswers();
            foreach($answers as $each) {
                static::$questionsAnswers[$each->getFormQuestion()->getId()] = $each->getAnswer();
            }
        }

        // Set Global Answers
        $globalAnswers = $this->doctrine->getRepository('MemberBundle:GlobalMemberAnswer')->findByMember($this->member);
        foreach($globalAnswers as $each) {
            static::$globalQuestionsAnswers[$each->getQuestionTemplate()->getId()] = $each->getAnswer();
        }

    }

    private function add(FormBuilderInterface $builder, FormElement $formElement)
    {

        if($formElement->getIsHiddenToMember()) {
            return;
        }
       
        // If Form Element has FormQuestion
        if($formQuestion = $formElement->getFormQuestion()) {

            $widgetConfig = \json_decode($formElement->getWidgetMetadata(), true);

            //Merge default widget_id constraints settings
            $widgetConfig = $this->mergeWithDefaultConstraints($widgetConfig);

            $defaultAnswer = isset(static::$questionsAnswers[$formQuestion->getId()]) ? static::$questionsAnswers[$formQuestion->getId()] : null;

            // Set Answer based on Global Answers
            if(isset(static::$globalQuestionsAnswers[$formQuestion->getQuestionTemplate()->getId()]) && $formQuestion->getIsGlobal()) {
                $defaultAnswer = static::$globalQuestionsAnswers[$formQuestion->getQuestionTemplate()->getId()];
            }
            
            //Check if current form is a state compliance form and set the state field
            $isComplianceFormState = $this->setComplianceFormState($formQuestion->getQuestionTemplate()->getName());

            $answer =  $isComplianceFormState ?  $isComplianceFormState : $defaultAnswer;

            $formOptions = $this->getFormOptions($formElement, $answer);

            $child = $this->fieldTypeFactory->createFieldTypeFromWidgetMetadata('form_question' . self::FIELD_SEPARATOR . $formQuestion->getId(), $widgetConfig, null, $formOptions);
                    
            $builder->add($child);

        } else {
            // Add element as CustomFormElement
            $builder->add('element_' . $formElement->getId(), CustomFormElementType::ALIAS, array('data' => $formElement));
        }
    }

    /*
        Check if the current form is a state compliance form
        @param Form Entity
        @return None
    */

    private function isStateComplianceForm($form)
    {
        $isStateComplianceForm = $this->doctrine->getRepository('ProductBundle:FormDefaultState')->findOneByForm($form);
        if ($isStateComplianceForm) {
            $this->isStateComplianceForm = $isStateComplianceForm;
        }
    }
    /*
        Set Compliance form state field
        @param question template name String
        @return state id Int
    */
    private function setComplianceFormState($questionTemplateName)
    {
        if ($this->isStateComplianceForm && $questionTemplateName == $this->usStateTemplateName) {
            return $this->isStateComplianceForm->getState()->getId();
        }
    }

    private function mergeWithDefaultConstraints($widgetConfig)
    {
        $defaultConstraints = $this->formWidgetDefaultConstraints;

        foreach($defaultConstraints as $widgetId => $defaultConstraints):
            if ($widgetConfig['widget_id'] == $widgetId) {
                $widgetConfig['widget_constraints'] = array_merge($widgetConfig['widget_constraints'], $defaultConstraints);
                break;
            }
        endforeach;

        return $widgetConfig;
    }
    
    /**
     * 
     * @param FormElement $formElement
     * @param string $answer 
     * 
     * @return multitype:multitype: string multitype:string
     */
    private function getFormOptions(FormElement $formElement, $answer = '')
    {
        $formQuestion = $formElement->getFormQuestion();
        $formElementRenderConfig = $this->renderConfigParser->parse($formElement->getRenderConfig());

        $isGlobal = $formQuestion->getIsGlobal() && ($answer !== "" && $answer !== null);

        $renderOptions = array(
            'display_label' => $formElementRenderConfig->getDisplayLabel(),
            'display_sublabel' => $formElementRenderConfig->getDisplaySubLabel(),
            'display_note' => $formElementRenderConfig->getDisplayNote(),
            'display_helptext' => $formElementRenderConfig->getDisplayHelptext(),
            'number_label' => $this->numberLabel++,
            'example' => $formQuestion->getExample(),
            'note' => $formQuestion->getNotes(),
            'sublabel' => $formQuestion->getSubLabel(),
            'note' => $formQuestion->getNotes(),
            'row_attr' => array( 
                'id' => 'formQuestion_' . $formQuestion->getId(),
                'data-default-display' => $formElementRenderConfig->getRenderAs(),
                'style' => $formElementRenderConfig->getStringRowStyle(), 
                'class' => $formElementRenderConfig->getWidgetSize() . ' form-question'
            )
        );

        if($formElementRenderConfig->getDependentsConfig()) {
            $renderOptions['row_attr']['data-dependents-config'] = json_encode($formElementRenderConfig->getDependentsConfig());
        }

        $formOptions = array(
            'label' => $formQuestion->getQuestion(),
            'helptext' => $formElementRenderConfig->getDisplayHelptext() ? $formQuestion->getHelpText() : '',
            'row_attr' => array('style' => $formElementRenderConfig->getStringRowStyle()),
            'attr' => array('data-formQuestionId' => $formQuestion->getId()),
            'is_global' => $isGlobal,
            'custom_render_options' => $renderOptions,
            'row_inner_container_attr' => array()
        );

        if($formQuestion && $formElementRenderConfig->getDisplayExample()) {
            $formOptions['attr']['placeholder'] = $formQuestion->getExample();
        }

        if($isGlobal) {
            $formOptions['attr']['class'] = self::GLOBAL_FIELD_CLASS;
        }
        
        if($answer !== null) {
            $formOptions['data'] = $answer;
        }

        return $formOptions;
    }
} 
