<?php
class ValidationException extends Exception {
  public function errorMessage() {
    $errorMsg = ['error' => 'Validation error: ' . $this->getMessage()];
    return $errorMsg;
  }
}