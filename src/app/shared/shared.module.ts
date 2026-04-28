import { NgModule } from "@angular/core";
import { SkeletonComponent } from "./widgets/skeleton/product/skeleton.component";
import { CardskeletonComponent } from "./widgets/skeleton/cardskeleton/cardskeleton.component";
import { AsideskeletonComponent } from "./widgets/skeleton/asideskeleton/asideskeleton.component";
import { CommonModule } from "@angular/common";
import { ToastComponent } from "./widgets/toast/toast.component";
import { SearchableSelectComponent } from "./widgets/searchable-select/searchable-select.component";

@NgModule({
    declarations:[
        CardskeletonComponent,
        AsideskeletonComponent,
        SkeletonComponent,
        ToastComponent,
        SearchableSelectComponent
    ],
    imports:[
        CommonModule
    ],
    providers:[],
    exports:[
        CardskeletonComponent,
        AsideskeletonComponent,
        SkeletonComponent,
        ToastComponent,
        SearchableSelectComponent
    ]
})

export class SharedModule {}