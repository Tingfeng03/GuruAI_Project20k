package com.example.demo.Repository;
import com.example.demo.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<Message, String>  {
    
}