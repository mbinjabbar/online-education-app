import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Subject } from '../../../core/models/subject.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subjects-card',
  imports: [RouterLink, CommonModule],
  templateUrl: './subjects-card.component.html',
  styleUrl: './subjects-card.component.css'
})
export class SubjectsCardComponent {
  @Input() subject!: Subject;
  @Output() editSubject = new EventEmitter<Subject>();
  @Output() deleteSubject = new EventEmitter<Subject>();

  onEdit(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.editSubject.emit(this.subject);
  }

  onDelete(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.deleteSubject.emit(this.subject);
  }
}