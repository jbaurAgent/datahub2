from typing import Dict, List, Union

from pydantic import BaseModel


class FieldParam(BaseModel):
    field_name: str
    field_type: str
    field_description: str = None


class create_dataset_params(BaseModel):
    dataset_name: str
    dataset_type: Union[str, Dict[str, str]]
    fields: List[FieldParam]
    dataset_owner: str = "no_owner"
    dataset_description: str = ""
    dataset_location: str = ""
    dataset_origin: str = ""
    hasHeader: str = "n/a"
    headerLine: int = 1
    dataset_rowcount = -1
    dataset_samples: Union[None, Dict[str, List[str]]] = None

    class Config:
        schema_extra = {
            "example": {
                "dataset_name": "name of dataset",
                "dataset_type": "text/csv",
                "dataset_description": "What this dataset is about...",
                "dataset_owner": "12345",
                "dataset_location": "the file can be found here @...",
                "dataset_origin": "this dataset found came from... ie internet",
                "hasHeader": "no",
                "headerLine": 1,
                "dataset_rowcount": 10,
                "dataset_fields": [
                    {
                        "field_name": "columnA",
                        "field_type": "string",
                        "field_description": "what is column A about",
                    },
                    {
                        "field_name": "columnB",
                        "field_type": "num",
                        "field_description": "what is column B about",
                    },
                ],
                "dataset_samples": {
                    "columnA": ["colA_sample1_in_string", "colA_sample2_in_string"],
                    "columnB": ["colB_sample1_in_string", "colB_sample2_in_string"],
                },
            }
        }


class dataset_status_params(BaseModel):
    dataset_name: str
    requestor: str
    platform: str


def determine_type(type_input: Union[str, Dict[str, str]]) -> str:
    """
    this list will grow when we have more dataset types in the form
    """
    if isinstance(type_input, Dict):
        type_input = type_input.get("dataset_type", "")
    if type_input.lower() in [
        "text/csv",
        "application/octet-stream",
        "application/vnd.ms-excel",
    ]:
        return "csv"
    if type_input.lower() == "json":
        return "json"
    else:
        return "undefined"
