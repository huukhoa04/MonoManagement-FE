import { NgModule } from "@angular/core";
import { CommentCardComponent } from "./comment-card/comment-card.component";
import { CommentFormComponent } from "./comment-form/comment-form.component";

const components = [
    CommentCardComponent,
    CommentFormComponent
]

@NgModule({
    declarations: [],
    imports: [
        ...components
    ],
    exports: [
        ...components
    ],
})
export class CommentModule { }