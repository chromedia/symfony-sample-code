<?php

namespace YPKY\FormBuilderBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use YPKY\ProductBundle\Entity\FormElementTypes;

class FormBuilderController extends Controller
{
    public function indexAction(Request $request)
    {
        $formQuestionBehavior = $this->getDoctrine()->getRepository('ProductBundle:DependentFormQuestionBehavior')->findAll();
        $formId = $request->get('id', null);
        $form = $formId ? $this->getDoctrine()->getRepository('ProductBundle:Form')->find($formId) : null;
        $wpForms = $this->get('helper.wordpress_platform')->getActiveFormsAsChoices();

        $params = array(
            'formId' => $formId,
            'form'   => $form,
            'wpForms' => $wpForms,
            'formQuestionBehavior' => $formQuestionBehavior,
            'selectedTab' => 'formBuilder',
            'formbuilderTab' => 'createForm'
        );

        return $this->render('FormBuilderBundle:FormBuilder:index.html.twig', $params);
    }
    
    public function configJsAction(Request $request)
    {
        $params['config'] = $this->container->getParameter('form_builder_config_js');
        $params['config']['questionType'] = FormElementTypes::QUESTION_TEMPLATE;
        $params['config']['htmlElementType'] = FormElementTypes::HTML_ELEMENT;

        $params['config'] = json_encode($params['config']);

        $response = $this->render('FormBuilderBundle:FormBuilder:config.js.twig', $params);
        $response->headers->set('content-type', 'application/javascript');

        return $response;        
    }
}
