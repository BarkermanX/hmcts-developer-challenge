package uk.gov.hmcts.reform.dev.models;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Task {

    private int id;
    private int caseId;
    private String title;
    private String description;
    private String statusCode;
    private String status;
    private LocalDateTime dueDate;
}