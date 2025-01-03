package pl.gpiwosz.wysiwyg.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Timestamp;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity
public class Wysiwyg {
  @Id
  @GeneratedValue(generator = "uuid2")
  public UUID id;
  public String name;
  public String description;

  @Column(columnDefinition = "TEXT")
  public String content;

  @CreationTimestamp
  @Column(updatable = false)
  private Timestamp creationDate;
}
