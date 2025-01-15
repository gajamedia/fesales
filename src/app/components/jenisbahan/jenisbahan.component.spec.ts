import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JenisbahanComponent } from './jenisbahan.component';

describe('JenisbahanComponent', () => {
  let component: JenisbahanComponent;
  let fixture: ComponentFixture<JenisbahanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JenisbahanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JenisbahanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
