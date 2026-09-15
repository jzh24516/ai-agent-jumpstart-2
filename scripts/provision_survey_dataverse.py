import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.request

sys.path.insert(0, os.path.dirname(__file__))

from auth import get_client, get_plugin_headers, get_token, load_env


SOLUTION_UNIQUE_NAME = "AgentJumpStartSurvey"
SOLUTION_DISPLAY_NAME = "Agent JumpStart Survey"
PUBLISHER_ID = "7709d15a-3fce-449c-8668-4f9c15b6ba40"
WORKSHOP_SCHEMA = "mjsrc_Workshop"
WORKSHOP_LOGICAL = "mjsrc_workshop"
SURVEY_SCHEMA = "mjsrc_SurveyResponse"
SURVEY_LOGICAL = "mjsrc_surveyresponse"


def label(value: str) -> dict:
    return {
        "@odata.type": "Microsoft.Dynamics.CRM.Label",
        "LocalizedLabels": [
            {
                "@odata.type": "Microsoft.Dynamics.CRM.LocalizedLabel",
                "Label": value,
                "LanguageCode": 1033,
            }
        ],
    }


def required_level(required: bool = False) -> dict:
    return {"Value": "ApplicationRequired" if required else "None"}


def string_attribute(
    schema_name: str,
    display_name: str,
    max_length: int,
    required: bool = False,
    primary: bool = False,
) -> dict:
    attribute = {
        "@odata.type": "Microsoft.Dynamics.CRM.StringAttributeMetadata",
        "SchemaName": schema_name,
        "DisplayName": label(display_name),
        "RequiredLevel": required_level(required),
        "MaxLength": max_length,
        "FormatName": {"Value": "Text"},
    }
    if primary:
        attribute["IsPrimaryName"] = True
    return attribute


def integer_attribute(
    schema_name: str,
    display_name: str,
    minimum: int,
    maximum: int,
    required: bool = False,
) -> dict:
    return {
        "@odata.type": "Microsoft.Dynamics.CRM.IntegerAttributeMetadata",
        "SchemaName": schema_name,
        "DisplayName": label(display_name),
        "RequiredLevel": required_level(required),
        "MinValue": minimum,
        "MaxValue": maximum,
        "Format": "None",
    }


def memo_attribute(schema_name: str, display_name: str, max_length: int) -> dict:
    return {
        "@odata.type": "Microsoft.Dynamics.CRM.MemoAttributeMetadata",
        "SchemaName": schema_name,
        "DisplayName": label(display_name),
        "RequiredLevel": required_level(),
        "MaxLength": max_length,
        "Format": "TextArea",
    }


def datetime_attribute(
    schema_name: str,
    display_name: str,
    behavior: str,
    date_format: str,
    required: bool = False,
) -> dict:
    return {
        "@odata.type": "Microsoft.Dynamics.CRM.DateTimeAttributeMetadata",
        "SchemaName": schema_name,
        "DisplayName": label(display_name),
        "RequiredLevel": required_level(required),
        "DateTimeBehavior": {"Value": behavior},
        "Format": date_format,
    }


def boolean_attribute(schema_name: str, display_name: str) -> dict:
    return {
        "@odata.type": "Microsoft.Dynamics.CRM.BooleanAttributeMetadata",
        "SchemaName": schema_name,
        "DisplayName": label(display_name),
        "RequiredLevel": required_level(True),
        "DefaultValue": False,
        "OptionSet": {
            "@odata.type": "Microsoft.Dynamics.CRM.BooleanOptionSetMetadata",
            "TrueOption": {
                "Value": 1,
                "Label": label("Yes"),
            },
            "FalseOption": {
                "Value": 0,
                "Label": label("No"),
            },
        },
    }


def table_definition(
    schema_name: str,
    display_name: str,
    display_collection_name: str,
    description: str,
    attributes: list[dict],
) -> dict:
    return {
        "@odata.type": "Microsoft.Dynamics.CRM.EntityMetadata",
        "SchemaName": schema_name,
        "DisplayName": label(display_name),
        "DisplayCollectionName": label(display_collection_name),
        "Description": label(description),
        "OwnershipType": "OrganizationOwned",
        "IsActivity": False,
        "HasActivities": False,
        "HasNotes": False,
        "PrimaryNameAttribute": "mjsrc_name",
        "Attributes": attributes,
    }


WORKSHOP_DEFINITION = table_definition(
    WORKSHOP_SCHEMA,
    "Agent JumpStart Workshop",
    "Agent JumpStart Workshops",
    "Workshop identity and customer context for Agent JumpStart survey analysis.",
    [
        string_attribute("mjsrc_Name", "Name", 200, required=True, primary=True),
        string_attribute("mjsrc_WorkshopKey", "Workshop Key", 200, required=True),
        string_attribute("mjsrc_CustomerName", "Customer Name", 200, required=True),
        string_attribute("mjsrc_HostName", "Host Name", 200),
        datetime_attribute("mjsrc_WorkshopStart", "Workshop Start", "DateOnly", "DateOnly"),
        datetime_attribute("mjsrc_WorkshopEnd", "Workshop End", "DateOnly", "DateOnly"),
        string_attribute("mjsrc_SourceSiteUrl", "Source Site URL", 500),
        integer_attribute("mjsrc_RetentionMonths", "Retention Months", 1, 120, required=True),
        string_attribute("mjsrc_PrivacyNoticeVersion", "Privacy Notice Version", 50),
    ],
)


SURVEY_DEFINITION = table_definition(
    SURVEY_SCHEMA,
    "Agent JumpStart Survey Response",
    "Agent JumpStart Survey Responses",
    "Participant feedback and lab completion evidence for Agent JumpStart workshops.",
    [
        string_attribute("mjsrc_Name", "Name", 200, required=True, primary=True),
        string_attribute("mjsrc_SubmissionId", "Submission ID", 100, required=True),
        string_attribute("mjsrc_WorkshopKey", "Workshop Key", 200, required=True),
        string_attribute("mjsrc_CustomerName", "Customer Name", 200, required=True),
        string_attribute("mjsrc_AttendeeEmail", "Attendee Email", 320),
        boolean_attribute("mjsrc_EmailConsent", "Email Consent"),
        datetime_attribute("mjsrc_SubmittedAt", "Submitted At", "UserLocal", "DateAndTime", required=True),
        datetime_attribute("mjsrc_RetentionExpiresAt", "Retention Expires At", "UserLocal", "DateAndTime", required=True),
        string_attribute("mjsrc_Locale", "Locale", 10, required=True),
        integer_attribute("mjsrc_Overall", "Overall Experience", 0, 5),
        integer_attribute("mjsrc_Effort", "Level of Effort", 0, 5),
        integer_attribute("mjsrc_Recommend", "Would Recommend", 0, 5),
        memo_attribute("mjsrc_Comments", "Comments", 10000),
        integer_attribute("mjsrc_CompletionPercent", "Completion Percent", 0, 100, required=True),
        integer_attribute("mjsrc_CompletedSteps", "Completed Steps", 0, 10000, required=True),
        integer_attribute("mjsrc_TotalSteps", "Total Steps", 0, 10000, required=True),
        memo_attribute("mjsrc_LabStatusJson", "Lab Status JSON", 100000),
        string_attribute("mjsrc_SourcePageUrl", "Source Page URL", 500),
        string_attribute("mjsrc_UserAgent", "User Agent", 500),
        integer_attribute("mjsrc_SchemaVersion", "Schema Version", 1, 100, required=True),
        string_attribute("mjsrc_ProcessingVersion", "Processing Version", 50),
    ],
)


def api_request(
    method: str,
    path: str,
    body: dict | None = None,
    solution_header: bool = False,
) -> tuple[dict | None, dict]:
    load_env()
    base_url = os.environ["DATAVERSE_URL"].rstrip("/")
    token = get_token()
    headers = get_plugin_headers("dv-metadata", token)
    headers.update(
        {
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
            "OData-MaxVersion": "4.0",
            "OData-Version": "4.0",
        }
    )
    if solution_header:
        headers["MSCRM.SolutionUniqueName"] = SOLUTION_UNIQUE_NAME
    payload = None if body is None else json.dumps(body).encode("utf-8")
    request = urllib.request.Request(
        f"{base_url}/api/data/v9.2/{path}",
        data=payload,
        headers=headers,
        method=method,
    )
    with urllib.request.urlopen(request, timeout=120) as response:
        response_body = response.read()
        parsed = json.loads(response_body) if response_body else None
        return parsed, dict(response.headers.items())


def get_table(logical_name: str) -> dict | None:
    try:
        result, _ = api_request(
            "GET",
            f"EntityDefinitions(LogicalName='{logical_name}')"
            "?$select=LogicalName,SchemaName,EntitySetName,MetadataId",
        )
        return result
    except urllib.error.HTTPError as error:
        if error.code == 404:
            return None
        raise


def attribute_exists(table_logical_name: str, attribute_logical_name: str) -> bool:
    try:
        api_request(
            "GET",
            f"EntityDefinitions(LogicalName='{table_logical_name}')/"
            f"Attributes(LogicalName='{attribute_logical_name}')?$select=LogicalName",
        )
        return True
    except urllib.error.HTTPError as error:
        if error.code == 404:
            return False
        raise


def ensure_solution(client) -> dict:
    existing = list(
        client.records.list(
            "solution",
            select=["solutionid", "uniquename", "friendlyname", "version"],
            filter=f"uniquename eq '{SOLUTION_UNIQUE_NAME}'",
        )
    )
    if existing:
        print(f"Reusing solution: {SOLUTION_UNIQUE_NAME}")
        return existing[0]

    client.records.create(
        "solution",
        {
            "uniquename": SOLUTION_UNIQUE_NAME,
            "friendlyname": SOLUTION_DISPLAY_NAME,
            "version": "1.0.0.0",
            "publisherid@odata.bind": f"/publishers({PUBLISHER_ID})",
        },
    )
    created = list(
        client.records.list(
            "solution",
            select=["solutionid", "uniquename", "friendlyname", "version"],
            filter=f"uniquename eq '{SOLUTION_UNIQUE_NAME}'",
        )
    )
    if not created:
        raise RuntimeError("Solution creation returned without a readable solution record")
    print(f"Created solution: {SOLUTION_UNIQUE_NAME}")
    return created[0]


def ensure_table(logical_name: str, definition: dict) -> bool:
    if get_table(logical_name):
        print(f"Reusing table: {logical_name}")
        return False
    api_request("POST", "EntityDefinitions", definition, solution_header=True)
    print(f"Created table: {logical_name}")
    return True


def publish_tables() -> None:
    parameter_xml = (
        "<importexportxml><entities>"
        f"<entity>{WORKSHOP_LOGICAL}</entity>"
        f"<entity>{SURVEY_LOGICAL}</entity>"
        "</entities></importexportxml>"
    )
    api_request("POST", "PublishXml", {"ParameterXml": parameter_xml})
    print("Published survey tables")


def ensure_alternate_key(
    client,
    table_schema_name: str,
    key_schema_name: str,
    columns: list[str],
    display_name: str,
) -> bool:
    keys = client.tables.get_alternate_keys(table_schema_name)
    if any(key.schema_name.lower() == key_schema_name.lower() for key in keys):
        print(f"Reusing alternate key: {key_schema_name}")
        return False
    client.tables.create_alternate_key(
        table_schema_name,
        key_schema_name,
        columns,
        display_name=display_name,
    )
    print(f"Created alternate key: {key_schema_name}")
    return True


def ensure_workshop_lookup(client) -> bool:
    if attribute_exists(SURVEY_LOGICAL, "mjsrc_workshopid"):
        print("Reusing lookup: mjsrc_workshopid")
        return False
    client.tables.create_lookup_field(
        referencing_table=SURVEY_LOGICAL,
        lookup_field_name="mjsrc_WorkshopId",
        referenced_table=WORKSHOP_LOGICAL,
        display_name="Workshop",
        solution=SOLUTION_UNIQUE_NAME,
    )
    print("Created lookup: mjsrc_workshopid")
    return True


def discover_publishers() -> None:
    client = get_client("dv-solution")
    publishers = list(
        client.records.list(
            "publisher",
            select=[
                "publisherid",
                "uniquename",
                "friendlyname",
                "customizationprefix",
            ],
            filter=(
                "customizationprefix ne 'none' "
                "and uniquename ne 'MicrosoftCorporation' "
                "and uniquename ne 'Microsoftdynamic'"
            ),
        )
    )

    print("SDK_CONNECTION_OK")
    for publisher in publishers:
        print(
            "\t".join(
                [
                    publisher.get("friendlyname", ""),
                    publisher.get("uniquename", ""),
                    publisher.get("customizationprefix", ""),
                    publisher.get("publisherid", ""),
                ]
            )
        )


def apply_schema() -> None:
    solution_client = get_client("dv-solution")
    metadata_client = get_client("dv-metadata")
    ensure_solution(solution_client)

    created_tables = [
        ensure_table(WORKSHOP_LOGICAL, WORKSHOP_DEFINITION),
        ensure_table(SURVEY_LOGICAL, SURVEY_DEFINITION),
    ]
    if any(created_tables):
        publish_tables()
        time.sleep(20)

    created_keys = [
        ensure_alternate_key(
            metadata_client,
            WORKSHOP_SCHEMA,
            "mjsrc_WorkshopKeyKey",
            ["mjsrc_workshopkey"],
            "Workshop Key",
        ),
        ensure_alternate_key(
            metadata_client,
            SURVEY_SCHEMA,
            "mjsrc_SubmissionIdKey",
            ["mjsrc_submissionid"],
            "Submission ID",
        ),
    ]
    if any(created_keys):
        time.sleep(20)

    created_lookup = ensure_workshop_lookup(metadata_client)
    if created_lookup:
        publish_tables()
        time.sleep(20)

    workshop = get_table(WORKSHOP_LOGICAL)
    survey = get_table(SURVEY_LOGICAL)
    if not workshop or not survey:
        raise RuntimeError("Survey schema verification failed")
    print(
        json.dumps(
            {
                "solution": SOLUTION_UNIQUE_NAME,
                "workshop": workshop,
                "surveyResponse": survey,
                "workshopKeys": [
                    key.schema_name
                    for key in metadata_client.tables.get_alternate_keys(WORKSHOP_SCHEMA)
                ],
                "surveyKeys": [
                    key.schema_name
                    for key in metadata_client.tables.get_alternate_keys(SURVEY_SCHEMA)
                ],
                "lookup": attribute_exists(SURVEY_LOGICAL, "mjsrc_workshopid"),
            },
            indent=2,
        )
    )


def seed_retention_test() -> None:
    client = get_client("dv-data")
    workshop_id = "60000000-0000-4000-8000-000000000001"
    response_id = "50000000-0000-4000-8000-000000000001"
    client.records.create(
        WORKSHOP_LOGICAL,
        {
            "mjsrc_workshopid": workshop_id,
            "mjsrc_name": "Retention E2E Test Workshop",
            "mjsrc_workshopkey": f"workshop:{workshop_id}",
            "mjsrc_customername": "Retention E2E Test Customer",
            "mjsrc_hostname": "Microsoft",
            "mjsrc_workshopstart": "2020-01-01",
            "mjsrc_workshopend": "2020-01-01",
            "mjsrc_retentionmonths": 24,
            "mjsrc_privacynoticeversion": "2026-09-15",
        },
    )
    client.records.create(
        SURVEY_LOGICAL,
        {
            "mjsrc_surveyresponseid": response_id,
            "mjsrc_name": "Retention E2E Test Response",
            "mjsrc_submissionid": response_id,
            "mjsrc_workshopkey": f"workshop:{workshop_id}",
            "mjsrc_customername": "Retention E2E Test Customer",
            "mjsrc_emailconsent": False,
            "mjsrc_submittedat": "2020-01-01T00:00:00Z",
            "mjsrc_retentionexpiresat": "2020-01-02T00:00:00Z",
            "mjsrc_locale": "en",
            "mjsrc_overall": 5,
            "mjsrc_effort": 2,
            "mjsrc_recommend": 5,
            "mjsrc_completionpercent": 100,
            "mjsrc_completedsteps": 1,
            "mjsrc_totalsteps": 1,
            "mjsrc_labstatusjson": "[]",
            "mjsrc_schemaversion": 1,
            "mjsrc_processingversion": "retention-e2e-v1",
            "mjsrc_WorkshopId@odata.bind": f"/mjsrc_workshops({workshop_id})",
        },
    )
    print(f"Seeded retention test response: {response_id}")


def clean_retention_test() -> None:
    client = get_client("dv-data")
    for table, primary_key, record_id in [
        (SURVEY_LOGICAL, "mjsrc_surveyresponseid", "50000000-0000-4000-8000-000000000001"),
        (WORKSHOP_LOGICAL, "mjsrc_workshopid", "60000000-0000-4000-8000-000000000001"),
    ]:
        existing = list(
            client.records.list(
                table,
                select=[primary_key],
                filter=f"{primary_key} eq {record_id}",
                top=1,
            )
        )
        if not existing:
            print(f"Retention test record already absent: {table} {record_id}")
            continue
        client.records.delete(table, record_id)
        print(f"Deleted retention test record: {table} {record_id}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Create or reuse the survey solution and schema.",
    )
    parser.add_argument("--seed-retention-test", action="store_true")
    parser.add_argument("--clean-retention-test", action="store_true")
    arguments = parser.parse_args()
    if arguments.apply:
        apply_schema()
    elif arguments.seed_retention_test:
        seed_retention_test()
    elif arguments.clean_retention_test:
        clean_retention_test()
    else:
        discover_publishers()


if __name__ == "__main__":
    main()
