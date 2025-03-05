import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Comment } from '../../../../core/models/comment.model';
import { ResButtonComponent } from '../../../../shared/res-button/res-button.component';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { MarkdownModule } from 'ngx-markdown';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-comment-card',
  standalone: true,
  imports: [
    CommonModule, 
    ResButtonComponent, 
    CommentFormComponent, 
    MarkdownModule,
    RouterModule
  ],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.css'
})
export class CommentCardComponent {
  @Input() comment!: Comment;
  @Input() postId!: number;
  @Input() currentUserId?: number;
  @Input() isReplying = false;
  @Input() level = 0; // For tracking nesting level
  @Input() maxLevel = 3; // Maximum level of nested replies to show

  @Output() upvote = new EventEmitter<number>();
  @Output() replyEvent = new EventEmitter<number>();
  @Output() cancelReply = new EventEmitter<number>();
  @Output() submitReply = new EventEmitter<{ content: string, postId: number, parentId: number }>();
  @Output() deleteComment = new EventEmitter<number>();
  
  showReplies = true; // Default to showing replies
  
  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours < 1) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return diffMinutes === 0 ? 'Just now' : `${diffMinutes}m ago`;
      }
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  }
  
  getInitials(username: string): string {
    if (!username) return '';
    return username.charAt(0).toUpperCase();
  }
  
  toggleReplies(): void {
    this.showReplies = !this.showReplies;
  }
  
  onReplyClick(): void {
    this.isReplying = true;
    this.replyEvent.emit(this.comment.id);
  }
  
  onUpvoteClick(): void {
    this.upvote.emit(this.comment.id);
  }
  
  onDeleteClick(): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.deleteComment.emit(this.comment.id);
    }
  }
  
  onReplySubmit(data: { content: string, postId: number, parentId?: number }): void {
    this.submitReply.emit({
      content: data.content,
      postId: data.postId,
      parentId: this.comment.id
    });
  }
  onReplyReceived(event: any) {
    this.replyEvent.emit(event);
  }
  onCancelReply(): void {
    this.cancelReply.emit(this.comment.id);
  }
  
  get isAuthor(): boolean {
    return this.currentUserId === this.comment.from_user?.id;
  }
  
  get hasReplies(): boolean {
    return !!this.comment.replies && this.comment.replies.length > 0;
  }
  
  get replyCount(): number {
    return this.comment.replies?.length || 0;
  }
  
  get showNestedReplies(): boolean {
    return this.level < this.maxLevel;
  }
}