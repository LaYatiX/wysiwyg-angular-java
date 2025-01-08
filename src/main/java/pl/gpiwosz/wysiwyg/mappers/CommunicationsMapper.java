package pl.gpiwosz.wysiwyg.mappers;

import org.mapstruct.Mapper;
import org.springframework.stereotype.Component;
import pl.gpiwosz.wysiwyg.dtos.CommunicationDto;
import pl.gpiwosz.wysiwyg.entities.Communications;

import java.util.List;

@Component
public class CommunicationsMapper {

  public Communications toEntity(CommunicationDto communicationDto) {
    return Communications.builder()
        .content(communicationDto.getContent())
        .id(communicationDto.getId())
        .build();
  }

  public List<CommunicationDto> toDtoList(List<Communications> communications) {
    return communications.stream()
        .map(this::toDto)
        .toList();
  }

  private CommunicationDto toDto(Communications communications) {
    return CommunicationDto.builder()
        .content(communications.getContent())
        .id(communications.getId())
        .build();
  }
}
