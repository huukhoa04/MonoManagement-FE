import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ResButtonComponent } from '../../../../shared/res-button/res-button.component';
import { CommentService } from '../../../../core/services/comment.service';
import { CreateCommentDto, CreateReplyDto } from '../../../../core/models/comment.model';
import { AuthService } from '../../../../core/services/auth.service';
import { finalize } from 'rxjs/operators';
import { Identifier } from '../../../../core/models/strapi-type.model';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ResButtonComponent],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.css'
})
export class CommentFormComponent implements OnInit {
  @Input() postId!: number;
  @Input() parentId?: number; // Optional for replies
  @Input() placeholder: string = 'Write a comment...';
  @Input() buttonText: string = 'Post';
  @Input() loading: boolean = false;
  @Input() minLength: number = 2;
  @Input() maxLength: number = 500;
  @Input() autoFocus: boolean = false;
  @Input() cancelable: boolean = false;
  
  @Output() submitComment = new EventEmitter<{content: string, postId: number, parentId?: number}>();
  @Output() cancelReply = new EventEmitter<void>();
  @Output() submissionStarted = new EventEmitter<void>();
  @Output() submissionComplete = new EventEmitter<boolean>(); // true for success, false for error
  
  commentForm!: FormGroup;
  submitted = false;
  isSubmitting = false;
  errorMessage: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private commentService: CommentService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    this.initForm();
  }
  
  initForm(): void {
    this.commentForm = this.fb.group({
      content: ['', [
        Validators.required,
        Validators.minLength(this.minLength),
        Validators.maxLength(this.maxLength)
      ]]
    });
    
    // Auto focus the textarea if specified
    if (this.autoFocus) {
      setTimeout(() => {
        const textarea = document.querySelector('.comment-textarea') as HTMLTextAreaElement;
        if (textarea) {
          textarea.focus();
        }
      }, 100);
    }
  }
  
  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = null;
    
    if (this.commentForm.invalid) {
      return;
    }
    
    const content = this.commentForm.get('content')?.value.trim();
    
    // Emit event for parent component to handle UI updates
    this.submitComment.emit({
      content,
      postId: this.postId,
      parentId: this.parentId
    });
    
    // Reset the form
    this.commentForm.reset();
    this.submitted = false;
  }
  
  /**
   * Submit directly using the service (alternative approach)
   */
  submitDirectly(): void {
    this.submitted = true;
    this.errorMessage = null;
    
    if (this.commentForm.invalid) {
      return;
    }
    
    const content = this.commentForm.get('content')?.value.trim();
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.errorMessage = 'You must be logged in to comment';
      return;
    }
    
    this.isSubmitting = true;
    this.submissionStarted.emit();
    
    if (this.isReply && this.parentId) {
      // Create a reply
      const replyData: CreateReplyDto = {
        data: {
          content,
          from_post: this.postId,
          from_user: currentUser.id as Identifier,
          parent: this.parentId
        }
      };
      
      this.commentService.createReply(replyData)
        .pipe(finalize(() => this.isSubmitting = false))
        .subscribe({
          next: (response) => {
            this.commentForm.reset();
            this.submitted = false;
            this.submissionComplete.emit(true);
          },
          error: (error) => {
            this.errorMessage = 'Failed to post reply. Please try again.';
            this.submissionComplete.emit(false);
          }
        });
    } else {
      // Create a top-level comment
      const commentData: CreateCommentDto = {
        data: {
          content,
          from_post: this.postId,
          from_user: currentUser.id as Identifier
        }
      };
      
      this.commentService.createComment(commentData)
        .pipe(finalize(() => this.isSubmitting = false))
        .subscribe({
          next: (response) => {
            this.commentForm.reset();
            this.submitted = false;
            this.submissionComplete.emit(true);
          },
          error: (error) => {
            this.errorMessage = 'Failed to post comment. Please try again.';
            this.submissionComplete.emit(false);
          }
        });
    }
  }
  
  onCancel(): void {
    this.cancelReply.emit();
    this.commentForm.reset();
    this.errorMessage = null;
  }
  
  get isReply(): boolean {
    return !!this.parentId;
  }
  
  get remainingChars(): number {
    const currentLength = this.commentForm.get('content')?.value?.length || 0;
    return this.maxLength - currentLength;
  }
  
  get contentControl() {
    return this.commentForm.get('content');
  }
  
  get hasError(): boolean {
    return (this.contentControl?.invalid && (this.contentControl.dirty || this.contentControl.touched || this.submitted)) as boolean;
  }
}