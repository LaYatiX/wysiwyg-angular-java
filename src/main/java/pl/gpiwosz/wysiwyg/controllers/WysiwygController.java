package pl.gpiwosz.wysiwyg.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import pl.gpiwosz.wysiwyg.entities.Wysiwyg;
import pl.gpiwosz.wysiwyg.services.WysiwygService;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class WysiwygController {

  private final WysiwygService wysiwygService;

  @PostMapping("/api/wysiwyg")
  public Wysiwyg save(@RequestBody Wysiwyg wysiwyg) {
    return wysiwygService.save(wysiwyg);
  }

  @GetMapping("/hello")
  public String save() {
    return "OK";
  }

  @GetMapping("/api/wysiwyg")
  public List<Wysiwyg> getWysiwyg() {
    return wysiwygService.getAllWysiwyg();
  }

  @GetMapping("/api/wysiwyg/{id}")
  public Wysiwyg getWysiwyg(@PathVariable UUID id) {
    return wysiwygService.getWysiwygById(id).orElseThrow();
  }
}
