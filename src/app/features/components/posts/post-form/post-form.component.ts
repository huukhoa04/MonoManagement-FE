import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../../../../core/services/post.service';
import { ResButtonComponent } from '../../../../shared/res-button/res-button.component';
import { finalize, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { Media } from '../../../../core/models/strapi-media.model';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ResButtonComponent ],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css'
})
export class PostFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private postService = inject(PostService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  
  postForm!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  isEditMode = false;
  postId: number | null = null;
  errorMessage = '';
  previewUrls: string[] = [];
  
  ngOnInit(): void {
    this.initForm();
    
    // Check if we're in edit mode (have a post ID)
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.isEditMode = true;
          this.postId = +id;
          this.isLoading = true;
          return this.postService.getPostById(+id);
        }
        return of(null);
      })
    ).subscribe({
      next: (response) => {
        if (response) {
          // Populate the form with existing post data
          const post = response.data;
          this.postForm.patchValue({
            content: post.content,
          });
          
          // If the post has media, add them to the form and previews
          if (post.medias && post.medias.length) {
            post.medias.forEach((media: Media) => {
              this.previewUrls.push(environment.baseUrl + media.url as string);
              (this.postForm.get('medias') as FormArray).push(
                this.fb.control(media)
              );
            });
          }
        }
      },
      error: (error) => {
        console.error('Error loading post:', error);
        this.errorMessage = 'Unable to load post. Please try again.';
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
  
  initForm(): void {
    this.postForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(500)]],
      medias: this.fb.array([]),
    });
  }
  
  get mediaList(): FormArray {
    return this.postForm.get('medias') as FormArray;
  }
  
  get pageTitle(): string {
    return this.isEditMode ? 'Edit Post' : 'Create New Post';
  }
  
  get submitButtonText(): string {
    return this.isEditMode ? 'Update Post' : 'Publish Post';
  }
  
  // File upload handling
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    
    const files = Array.from(input.files);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size < 5 * 1024 * 1024
    );
    
    validFiles.forEach(file => {
      // For simplicity, we're just adding file URLs directly
      // In a real app, you'd upload these to your server first
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Assuming the server returns the media URL after upload
        const mediaUrl = reader.result as string;
        this.previewUrls.push(mediaUrl);
        this.mediaList.push(this.fb.control(mediaUrl));
      };
    });
  }
  
  removeMedia(index: number): void {
    this.mediaList.removeAt(index);
    this.previewUrls.splice(index, 1);
  }
  
  onSubmit(): void {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }
    
    this.isSubmitting = true;
    const content = this.postForm.get('content')?.value;
    const medias = this.mediaList.value;
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      this.errorMessage = 'You must be logged in to create a post';
      return;
    }
    
    if (this.isEditMode && this.postId) {
      // Update existing post
      this.postService.updatePost(this.postId, { 
        content, 
        medias 
      }).pipe(
        finalize(() => this.isSubmitting = false)
      ).subscribe({
        next: () => {
          this.router.navigate(['/posts', this.postId]);
        },
        error: (error) => {
          console.error('Error updating post:', error);
          this.errorMessage = 'Failed to update post. Please try again.';
        }
      });
    } else {
      // Create new post
      this.postService.createPost(
        content,
        currentUser.documentId as string, // Assuming the user ID is available
        medias
      ).pipe(
        finalize(() => this.isSubmitting = false)
      ).subscribe({
        next: (response) => {
          this.router.navigate(['/posts', response.data.id]);
        },
        error: (error) => {
          console.error('Error creating post:', error);
          this.errorMessage = 'Failed to create post. Please try again.';
        }
      });
    }
  }
  
  cancelEdit(): void {
    if (this.isEditMode && this.postId) {
      this.router.navigate(['/posts', this.postId]);
    } else {
      this.router.navigate(['/posts']);
    }
  }
}