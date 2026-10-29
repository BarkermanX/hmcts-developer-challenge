package uk.gov.hmcts.reform.dev.models;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ExampleCase {

    private int id;
    private String caseNumber;
    private String title;
    private String description;
    private String status;
    private LocalDateTime createdDate;

    public String getLocalDate() {
        if (createdDate == null) {
            return "";
        }

        return createdDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }
}
