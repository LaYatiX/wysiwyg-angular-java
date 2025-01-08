package pl.gpiwosz.wysiwyg.dtos;


import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class CommunicationDto {
  public UUID id;
  public String content;
}
