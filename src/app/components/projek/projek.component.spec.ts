import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjekComponent } from './projek.component';

describe('ProjekComponent', () => {
  let component: ProjekComponent;
  let fixture: ComponentFixture<ProjekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjekComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
