import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Post } from '../../../../core/models/post.model';
import { MarkdownModule } from 'ngx-markdown';
import { ResButtonComponent } from '../../../../shared/res-button/res-button.component';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [CommonModule, RouterModule, MarkdownModule, ResButtonComponent],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent {
  @Input() post!: Post;
  @Output() upvotePost = new EventEmitter<number>();
  @Output() sharePost = new EventEmitter<number>();
  
  get displayMedias() {
    // Only show up to 4 images in the preview
    return this.post?.medias?.slice(0, 4) || [];
  }
  
  get hasMoreMedias(): boolean {
    return (this.post?.medias?.length || 0) > 4;
  }
  
  get additionalMediaCount(): number {
    return (this.post?.medias?.length || 0) - 4;
  }
  
  getInitials(): string {
    const username = this.post?.poster?.username || '';
    return username.charAt(0).toUpperCase();
  }
  
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
  
  truncateContent(content: string): string {
    if (!content) return '';
    
    const maxLength = 250;
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  }
  
  onUpvote(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.upvotePost.emit(this.post.id);
  }
  
  onShare(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.sharePost.emit(this.post.id);
  }
  
  navigateToPost(): void {
    // Navigation handled by routerLink in template
    
  }
}