package in.strikes.CRUD.Repository;

import in.strikes.CRUD.Entity.Student;
import in.strikes.CRUD.Service.StudentService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

//@Repository
public interface StudentRepository extends JpaRepository<Student, Long>{

}


