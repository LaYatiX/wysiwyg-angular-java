package pl.gpiwosz.wysiwyg.services;

import org.springframework.stereotype.Service;
import pl.gpiwosz.wysiwyg.entities.Communications;
import pl.gpiwosz.wysiwyg.repositories.WysiwygRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class WysiwygService {

  private final WysiwygRepository wysiwygRepository;

  public WysiwygService(WysiwygRepository wysiwygRepository) {
    this.wysiwygRepository = wysiwygRepository;
  }

  public Optional<Communications> getWysiwygById(final UUID id) {
    return wysiwygRepository.findById(id);
  }

  public List<Communications> getAllWysiwyg() {
    return wysiwygRepository.findAll();
  }

  public Communications save(Communications communications) {
    return wysiwygRepository.save(communications);
  }
}
