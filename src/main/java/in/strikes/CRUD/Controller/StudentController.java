package in.strikes.CRUD.Controller;

import in.strikes.CRUD.Entity.Student;
import in.strikes.CRUD.Service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController{

    private StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    //create table
//    public Student createStudent(@RequestBody Student student) {
//        Student createdStudent = studentService.createStudent(student);
//        return createdStudent;
//    }

    //Create table  or  insert the value
    @PostMapping("/create")
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        Student createdStudent = studentService.createStudent(student);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdStudent);
    }

    //Retrive perticular value
    @GetMapping("/get/{id}")
    public ResponseEntity<Student> getStudent (@PathVariable Long id){
        Student studentResp = studentService.getStudent(id);
        if(studentResp == null){
             return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(studentResp);
    }

    //Retrive all values
    @GetMapping("/getAll")
    public ResponseEntity<List<Student>> getAllStudent (){
        List<Student> studentList = studentService.getAllStudent();
        if(studentList.isEmpty()){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(studentList);
    }

    //Update one record
    @PutMapping("/update/{id}")
    public ResponseEntity<Student> updateStudent (@PathVariable Long id, @RequestBody Student studentreq){
        Student studentResp = studentService.updateStudent(id, studentreq);
        if(studentResp == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(studentResp);
    }

    //Delete the record
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteStudent(@PathVariable Long id) {
        Boolean isDeleted = studentService.deleteStudent(id);
        if(!isDeleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok("Record deleted");
    }
}
