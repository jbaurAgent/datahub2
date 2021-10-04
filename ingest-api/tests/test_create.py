import json
import os

from datahub.metadata.com.linkedin.pegasus2avro.metadata.snapshot import DatasetSnapshot
from datahub.metadata.com.linkedin.pegasus2avro.mxe import MetadataChangeEvent
from datahub.metadata.schema_classes import DatasetLineageTypeClass

from ingest_api.helper.mce_convenience import (
    generate_mce_json_output,
    make_browsepath_mce,
    make_dataprofile,
    make_dataset_description_mce,
    make_dataset_urn,
    make_delete_mce,
    make_institutionalmemory_mce,
    make_lineage_mce,
    make_ownership_mce,
    make_platform,
    make_recover_mce,
    make_schema_mce,
    make_user_urn,
)
from ingest_api.helper.models import determine_type


def test_make_csv_dataset(
    inputs={
        "dataset_name": "my_test_dataset",
        "dataset_type": "csv",
        "dataset_owner": "34552",
        "dataset_description": "hello this is description of dataset",
        "fields": [
            {
                "fieldPath": "field1",
                "field_type": "string",
                "field_description": "col1 description",
            },
            {
                "fieldPath": "field2",
                "field_type": "num",
                "field_description": "col2 description",
            },
        ],
        "dataset_origin": "origin of dataset",
        "dataset_location": "location of dataset",
        "dataset_rowcount": 100,
        "dataset_samples": {
            "field1": ["sample_val1", "sample_value2"],
            "field2": ["123", "345"],
        },
    },
    specified_time=1625108310242,
):
    """ "
    This test is meant to test if datahub.metadata.schema_classes have changed definitions.
    Once definitions have changed, the API will fail to emit the correct MCE.
    Hence, if this function is unable to generate a valid MCE to compare to a existing MCE json,
    it is time to update the code.
    Also, not all MCE can be compared. I did not include the option to specific specific timestamps
    for all functions, because I think it is unnecessary. Hence, comparing to golden_mce.json is impossible
    for some aspects. But, if the test_function run ok, i believe it is safe to assume the code is well.
    """
    dataset_urn = make_dataset_urn(
        platform=inputs["dataset_type"], name=inputs["dataset_name"]
    )
    owner_urn = make_user_urn(inputs["dataset_owner"])
    output_mce = make_schema_mce(
        dataset_urn=dataset_urn,
        platformName=make_platform(inputs["dataset_type"]),
        actor=owner_urn,
        fields=inputs["fields"],
        system_time=specified_time,
    )
    ownership_mce = make_ownership_mce(actor=owner_urn, dataset_urn=dataset_urn)
    memory_mce = make_institutionalmemory_mce(
        dataset_urn=dataset_urn,
        input_url=["www.yahoo.com", "www.google.com"],
        input_description=["yahoo", "google"],
        actor=owner_urn,
    )
    lineage_mce = make_lineage_mce(
        upstream_urns=[
            "urn:li:dataset:(urn:li:dataPlatform:csv,my_upstream_dataset,PROD)"
        ],
        downstream_urn=dataset_urn,
        actor=owner_urn,
        lineage_type=DatasetLineageTypeClass.TRANSFORMED,
    )
    description_mce = make_dataset_description_mce(
        dataset_name=dataset_urn,
        description=inputs["dataset_description"],
        customProperties={
            "dataset_origin": inputs["dataset_origin"],
            "dataset_location": inputs["dataset_location"],
        },
    )
    path_mce = make_browsepath_mce(
        dataset_urn=dataset_urn, path=["/csv/my_test_dataset"]
    )
    data_sample = make_dataprofile(
        samples=inputs["dataset_samples"],
        data_rowcount=inputs["dataset_rowcount"],
        fields=inputs["fields"],
        dataset_name=dataset_urn,
        specified_time=specified_time,
    )
    output_path = os.path.join(
        os.path.dirname(os.path.realpath(__file__)), "test_create_output.json"
    )
    golden_file_path = os.path.join(
        os.path.dirname(os.path.realpath(__file__)), "golden_schema_mce.json"
    )
    dataset_snapshot = DatasetSnapshot(
        urn=dataset_urn,
        aspects=[output_mce, description_mce, path_mce],
    )
    metadata_record = MetadataChangeEvent(proposedSnapshot=dataset_snapshot)
    print(data_sample)
    generate_mce_json_output(
        metadata_record,
        data_sample,
        file_loc=os.path.dirname(os.path.realpath(__file__)),
        filename="test_create_output",
    )
    with open(output_path, "r") as f:
        generated_dict = json.dumps(json.load(f), sort_keys=True)
    with open(golden_file_path, "r") as f:
        golden_mce = json.dumps(json.load(f), sort_keys=True)
    assert generated_dict == golden_mce


def test_delete_undo(
    inputs={"dataset_name": "my_test_dataset", "dataset_type": "csv"}
) -> None:
    dataset_urn = make_dataset_urn(
        platform=inputs["dataset_type"], name=inputs["dataset_name"]
    )
    delete_mce = make_delete_mce(dataset_urn)
    undo_delete_mce = make_recover_mce(dataset_urn)
    output_delete_path = os.path.join(
        os.path.dirname(os.path.realpath(__file__)), "test_delete_mce_output.json"
    )
    output_undelete_path = os.path.join(
        os.path.dirname(os.path.realpath(__file__)), "test_undo_delete_mce_output.json"
    )
    golden_delete_file_path = os.path.join(
        os.path.dirname(os.path.realpath(__file__)), "golden_delete_mce.json"
    )
    golden_undo_file_path = os.path.join(
        os.path.dirname(os.path.realpath(__file__)), "golden_delete_undo_mce.json"
    )
    generate_mce_json_output(
        delete_mce,
        data_sample=None,
        file_loc=os.path.dirname(os.path.realpath(__file__)),
        filename="test_delete_mce_output",
    )
    generate_mce_json_output(
        undo_delete_mce,
        data_sample=None,
        file_loc=os.path.dirname(os.path.realpath(__file__)),
        filename="test_undo_delete_mce_output",
    )
    with open(output_delete_path, "r") as f:
        delete_mce = json.dumps(json.load(f), sort_keys=True)
    with open(output_undelete_path, "r") as f:
        undelete_mce = json.dumps(json.load(f), sort_keys=True)
    with open(golden_delete_file_path, "r") as f:
        golden_delete_mce = json.dumps(json.load(f), sort_keys=True)
    with open(golden_undo_file_path, "r") as f:
        golden_undelete_mce = json.dumps(json.load(f), sort_keys=True)
    assert delete_mce == golden_delete_mce
    assert undelete_mce == golden_undelete_mce


def test_type_string():
    assert determine_type("text/csv") == "csv"
    assert determine_type({"dataset_type": "application/octet-stream"}) == "csv"
    assert determine_type("garbage") != "csv"
