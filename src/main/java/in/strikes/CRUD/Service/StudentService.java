package in.strikes.CRUD.Service;

import in.strikes.CRUD.Entity.Student;
import in.strikes.CRUD.Repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static org.antlr.v4.runtime.tree.xpath.XPath.findAll;

// Business logic !
// Store to db  ---  just it is get used for data filtering here

@Service
public class StudentService {

    private StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository){
        this.studentRepository = studentRepository;
    }


    //Method for inserting value in the table / also for creating table
    public Student createStudent(Student studentReq){
        Student studentResp = studentRepository.save(studentReq);
        return studentResp;
    }

    //Method for retriving 1 value
    public Student getStudent(Long id){
        Optional<Student> studentResp = studentRepository.findById(id);
        if(studentResp.isPresent()){
            return studentResp.get();
        }
        return null;
    }

    //Method for retriving all value
    public List<Student> getAllStudent(){
        List<Student> studentList= studentRepository.findAll();
        return studentList;
    }

    //Update
    public Student updateStudent(Long id, Student studentreq){
        Optional<Student> existingStudent = studentRepository.findById(id);
        if(existingStudent.isEmpty()){
            return null;
        }
        Student studentTosave = existingStudent.get();
        studentTosave.setId(studentreq.getId());
        studentTosave.setEmail(studentreq.getEmail());
        studentTosave.setName(studentreq.getName());

        return studentRepository.save(studentTosave);
    }

    //delete
    public Boolean deleteStudent(Long id) {
        Boolean isStudent = studentRepository.existsById(id);
        if(!isStudent) return false;
        studentRepository.deleteById(id);
        return true;
    }
}


