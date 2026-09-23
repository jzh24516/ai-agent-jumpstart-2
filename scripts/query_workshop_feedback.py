"""Read normalized workshop survey responses from Dataverse for Maker mode."""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime
from typing import Any

sys.path.insert(0, os.path.join(os.getcwd(), "scripts"))

from auth import get_client


SURVEY_TABLE = "mjsrc_surveyresponse"
UUID_PATTERN = (
    r"^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-"
    r"[89ab][0-9a-f]{3}-[0-9a-f]{12}$"
)
SELECT_COLUMNS = [
    "mjsrc_surveyresponseid",
    "mjsrc_submissionid",
    "mjsrc_attendeeemail",
    "mjsrc_emailconsent",
    "mjsrc_submittedat",
    "mjsrc_retentionexpiresat",
    "mjsrc_locale",
    "mjsrc_overall",
    "mjsrc_effort",
    "mjsrc_recommend",
    "mjsrc_comments",
    "mjsrc_completionpercent",
    "mjsrc_completedsteps",
    "mjsrc_totalsteps",
    "mjsrc_labstatusjson",
]
OUTPUT_PREFIX = "AGENT_JUMPSTART_FEEDBACK_JSON="


def parse_lab_status(value: Any) -> list[dict[str, Any]]:
    if not isinstance(value, str) or not value.strip():
        return []
    try:
        parsed = json.loads(value)
    except json.JSONDecodeError:
        return []
    if not isinstance(parsed, list):
        return []

    normalized = []
    for item in parsed:
        if not isinstance(item, dict):
            continue
        lab_id = item.get("labId")
        completed_steps = item.get("completedSteps")
        total_steps = item.get("totalSteps")
        completed_step_ids = item.get("completedStepIds")
        if not isinstance(lab_id, str):
            continue
        if not isinstance(completed_steps, int) or not isinstance(total_steps, int):
            continue
        normalized.append(
            {
                "labId": lab_id,
                "completedSteps": max(0, completed_steps),
                "totalSteps": max(0, total_steps),
                "completedStepIds": [
                    step_id
                    for step_id in completed_step_ids or []
                    if isinstance(step_id, str)
                ],
            }
        )
    return normalized


def as_int(record: Any, key: str, minimum: int, maximum: int) -> int:
    value = record.get(key)
    if isinstance(value, bool):
        return minimum
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        return minimum
    return min(maximum, max(minimum, parsed))


def as_text(record: Any, key: str, maximum: int) -> str:
    value = record.get(key)
    return value.strip()[:maximum] if isinstance(value, str) else ""


def normalize_response(record: Any) -> dict[str, Any]:
    email_consent = bool(record.get("mjsrc_emailconsent"))
    return {
        "id": as_text(record, "mjsrc_surveyresponseid", 36),
        "submissionId": as_text(record, "mjsrc_submissionid", 100),
        "submittedAt": as_text(record, "mjsrc_submittedat", 64),
        "retentionExpiresAt": as_text(record, "mjsrc_retentionexpiresat", 64),
        "locale": as_text(record, "mjsrc_locale", 10),
        "overall": as_int(record, "mjsrc_overall", 0, 5),
        "effort": as_int(record, "mjsrc_effort", 0, 5),
        "recommend": as_int(record, "mjsrc_recommend", 0, 5),
        "comments": as_text(record, "mjsrc_comments", 10_000),
        "completionPercent": as_int(record, "mjsrc_completionpercent", 0, 100),
        "completedSteps": as_int(record, "mjsrc_completedsteps", 0, 10_000),
        "totalSteps": as_int(record, "mjsrc_totalsteps", 0, 10_000),
        "emailConsent": email_consent,
        "attendeeEmail": (
            as_text(record, "mjsrc_attendeeemail", 320) if email_consent else ""
        ),
        "labStatus": parse_lab_status(record.get("mjsrc_labstatusjson")),
    }


def sort_key(response: dict[str, Any]) -> float:
    value = response.get("submittedAt", "")
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).timestamp()
    except (TypeError, ValueError):
        return 0


def query_feedback(workshop_id: str) -> list[dict[str, Any]]:
    workshop_key = f"workshop:{workshop_id}"
    escaped_key = workshop_key.replace("'", "''")
    client = get_client("dv-query")
    records = client.records.list(
        SURVEY_TABLE,
        select=SELECT_COLUMNS,
        filter=f"mjsrc_workshopkey eq '{escaped_key}'",
    )
    responses = [normalize_response(record) for record in records]
    responses.sort(key=sort_key, reverse=True)
    return responses


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--workshop-id", required=True)
    arguments = parser.parse_args()

    import re

    if not re.fullmatch(UUID_PATTERN, arguments.workshop_id, flags=re.IGNORECASE):
        raise ValueError("workshop-id must be a UUID")

    payload = {
        "workshopId": arguments.workshop_id,
        "responses": query_feedback(arguments.workshop_id),
    }
    print(f"{OUTPUT_PREFIX}{json.dumps(payload, ensure_ascii=True, separators=(',', ':'))}")


if __name__ == "__main__":
    main()
