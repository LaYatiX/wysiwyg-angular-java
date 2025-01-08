package pl.gpiwosz.wysiwyg.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.gpiwosz.wysiwyg.entities.Communications;

import java.util.UUID;

@Repository
public interface WysiwygRepository extends JpaRepository<Communications, UUID> {
}
