package pl.gpiwosz.wysiwyg.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import pl.gpiwosz.wysiwyg.dtos.CommunicationDto;
import pl.gpiwosz.wysiwyg.entities.Communications;
import pl.gpiwosz.wysiwyg.mappers.CommunicationsMapper;
import pl.gpiwosz.wysiwyg.services.WysiwygService;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class WysiwygController {

  private final WysiwygService wysiwygService;
  private final CommunicationsMapper communicationsMapper;

  @PostMapping("/api/wysiwyg")
  public Communications save(@RequestBody CommunicationDto communications) {
    return wysiwygService.save(communicationsMapper.toEntity(communications));
  }

  @GetMapping("/api/wysiwyg")
  public List<CommunicationDto> getWysiwyg() {
    return communicationsMapper.toDtoList(wysiwygService.getAllWysiwyg());
  }

  @GetMapping("/api/wysiwyg/{id}")
  public Communications getWysiwyg(@PathVariable UUID id) {
    return wysiwygService.getWysiwygById(id).orElseThrow();
  }
}
