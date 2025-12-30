package intelizign.tcuserapp.backend.exception;

public class DeletionNotAllowedException extends RuntimeException {

    public DeletionNotAllowedException(String message) {
        super(message);
    }
}
