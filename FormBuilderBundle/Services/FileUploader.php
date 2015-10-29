<?php

namespace YPKY\FormBuilderBundle\Services;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use YPKY\FormBuilderBundle\Services\FileUploaderInterface;

/**
 * @author  Farly Taboada
 */
class FileUploader implements FileUploaderInterface
{
    public function setUploadDirectory($uploadDirectory)
    {
        $this->uploadDirectory = $uploadDirectory;
    }


    public function uploadFile(UploadedFile $file)
    {
        if (!$file->isValid()) {
            return $file->getError();
        }

        $caption = $file->getClientOriginalName();
        //$filename = $this->generateUniqueFilename($file);
        
        $this->createDirectory();
        $file->move($this->uploadDirectory, $caption);    
        
        

        return $caption;
    }

    private function createDirectory()
    {
        if (!file_exists($this->uploadDirectory)) {
            mkdir($this->uploadDirectory, 775);
        }
    }

    /**
     * 
     * @param UploadedFile $file
     * @return string Unique filename based on microtime
     */
    private function generateUniqueFilename(UploadedFile $file)
    {
        return uniqid() . '.' . pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION);
    }
}
