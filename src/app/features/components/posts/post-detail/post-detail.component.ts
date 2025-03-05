import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MarkdownModule } from 'ngx-markdown';
import { PostService } from '../../../../core/services/post.service';
import { CommentService } from '../../../../core/services/comment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { CommentModule } from '../../comments/comment.module';
import { Post } from '../../../../core/models/post.model';
import { Comment, CreateCommentDto, CreateReplyDto } from '../../../../core/models/comment.model';
import { ResButtonComponent } from '../../../../shared/res-button/res-button.component';
import { Subject, takeUntil, finalize } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { Identifier } from '../../../../core/models/strapi-type.model';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MarkdownModule,
    CommentModule,
    ResButtonComponent
  ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit, OnDestroy {
  post: Post | null = null;
  comments: Comment[] = [];
  isLoading = true;
  isLoadingComments = false;
  submittingComment = false;
  replyingToCommentId: Identifier | null = null;
  errorMessage: string | null = null;
  currentUser: any = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private commentService: CommentService,
    private authService: AuthService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
    
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.loadPost(parseInt(id, 10));
        } else {
          this.navigateToNotFound();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private getCurrentUser(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  private loadPost(postId: number): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.postService.getPostById(postId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          this.post = response.data;
          this.titleService.setTitle(`${this.post.poster.username}'s Post | Mono Management`);
          
          // Load comments after post is loaded
          this.loadComments(postId);
        },
        error: (err) => {
          console.error('Error loading post:', err);
          this.errorMessage = 'Failed to load the post. Please try again later.';
        }
      });
  }

  private loadComments(postId: number): void {
    this.isLoadingComments = true;
    
    this.commentService.getCommentsByPostId(postId)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.isLoadingComments = false)
      )
      .subscribe({
        next: (response) => {
          this.comments = response.data;
          
          // Check for fragment (comment id) in URL for direct navigation
          setTimeout(() => this.scrollToCommentIfNeeded(), 100);
        },
        error: (err) => {
          console.error('Error loading comments:', err);
        }
      });
  }

  private scrollToCommentIfNeeded(): void {
    const fragment = this.route.snapshot.fragment;
    if (fragment && fragment.startsWith('comment-')) {
      const commentId = fragment.replace('comment-', '');
      const element = document.getElementById(`comment-${commentId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('highlight-comment');
        setTimeout(() => element.classList.remove('highlight-comment'), 3000);
      }
    }
  }

  private navigateToNotFound(): void {
    this.router.navigate(['/not-found']);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  handleCommentSubmit(data: { content: string, postId: number }): void {
    if (!this.currentUser) {
      this.router.navigate(['/auth/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }
    
    this.submittingComment = true;
    
    // Create comment data according to your API's expected format
    const commentData: CreateCommentDto = {
      data: {
        content: data.content,
        from_post: data.postId,
        from_user: this.currentUser.id
      }
    };
    
    this.commentService.createComment(commentData)
      .pipe(finalize(() => this.submittingComment = false))
      .subscribe({
        next: (response) => {
          // Add the new comment to the list
          this.comments = [response.data, ...this.comments];
        },
        error: (error) => {
          console.error('Error creating comment:', error);
        }
      });
  }

  onReplyComment(commentId: Identifier): void {
    if (!this.currentUser) {
      this.router.navigate(['/auth/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }
    
    this.replyingToCommentId = commentId;
  }

  onCancelReply(): void {
    this.replyingToCommentId = null;
  }

  handleReplySubmit(data: { content: string, postId: Identifier, parentId?: Identifier }): void {
    if (!data.parentId || !this.currentUser) return;
    
    // Create reply data according to your API's expected format
    const replyData: CreateReplyDto = {
      data: {
        content: data.content,
        from_post: data.postId,
        from_user: this.currentUser.id,
        parent: data.parentId
      }
    };
    
    this.commentService.createReply(replyData)
      .subscribe({
        next: (response) => {
          // Find parent comment and add reply
          const updatedComments = [...this.comments];
          const addReplyToComment = (comments: Comment[], parentId: Identifier): boolean => {
            for (let i = 0; i < comments.length; i++) {
              if (comments[i].id === parentId) {
                if (!comments[i].replies) {
                  comments[i].replies = [];
                }
                comments[i].replies?.push(response.data);
                return true;
              }
            }
            return false;
          };
          
          if (addReplyToComment(updatedComments, data.parentId as Identifier)) {
            this.comments = updatedComments;
          }
          
          this.replyingToCommentId = null;
        },
        error: (error) => {
          console.error('Error creating reply:', error);
        }
      });
  }

  onUpvoteComment(commentId: number): void {
    if (!this.currentUser) {
      this.router.navigate(['/auth/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }
    
    this.commentService.upvoteComment(commentId)
      .subscribe({
        next: (response: any) => {
          // Update upvote count in UI
          const updateCommentUpvote = (comments: Comment[], id: number, upvote: number): boolean => {
            for (let i = 0; i < comments.length; i++) {
              if (comments[i].id === id) {
                comments[i].upvote = upvote;
                return true;
              }
              if (comments[i].replies && updateCommentUpvote(comments[i].replies as Comment[], id, upvote)) {
                return true;
              }
            }
            return false;
          };
          
          const updatedComments = [...this.comments];
          if (updateCommentUpvote(updatedComments, commentId, response.data.upvote)) {
            this.comments = updatedComments;
          }
        },
        error: (err: any) => {
          console.error('Error upvoting comment:', err);
        }
      });
  }

  onDeleteComment(commentId: Identifier): void {
    this.commentService.deleteComment(commentId)
      .subscribe({
        next: () => {
          // Remove comment from UI
          const removeComment = (comments: Comment[], id: Identifier): Comment[] => {
            return comments.filter(comment => {
              if (comment.id === id) {
                return false; // Remove this comment
              }
              
              if (comment.replies && comment.replies.length > 0) {
                comment.replies = removeComment(comment.replies, id);
              }
              
              return true; // Keep other comments
            });
          };
          
          this.comments = removeComment(this.comments, commentId);
        },
        error: (err) => {
          console.error('Error deleting comment:', err);
        }
      });
  }

  onUpvotePost(): void {
    if (!this.post) return;
    if (!this.currentUser) {
      this.router.navigate(['/auth/login'], { 
        queryParams: { returnUrl: this.router.url } 
      });
      return;
    }
    
    this.postService.upvotePost(this.post.id)
      .subscribe({
        next: (response) => {
          if (this.post) {
            this.post = {
              ...this.post,
              upvote: response.data.upvote
            };
          }
        },
        error: (err) => {
          console.error('Error upvoting post:', err);
        }
      });
  }

  onSharePost(): void {
    if (!this.post) return;
    
    if (navigator.share) {
      navigator.share({
        title: `${this.post.poster.username}'s Post | Mono Management`,
        text: this.post.content.substring(0, 100) + '...',
        url: window.location.href
      }).catch((err) => console.error('Error sharing:', err));
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(() => console.error('Failed to copy link'));
    }
  }

  goBack(): void {
    this.router.navigate(['/posts']);
  }
}