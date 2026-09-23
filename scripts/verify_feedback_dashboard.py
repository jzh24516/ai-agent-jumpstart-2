"""Focused tests for feedback dashboard record normalization."""

from __future__ import annotations

import json
import os
import sys

sys.path.insert(0, os.path.join(os.getcwd(), "scripts"))

import query_workshop_feedback
from query_workshop_feedback import normalize_response, parse_lab_status


LAB_STATUS = [
    {
        "labId": "lab-01",
        "completedSteps": 3,
        "totalSteps": 5,
        "completedStepIds": ["one", "two", "three"],
    }
]

record = {
    "mjsrc_surveyresponseid": "10000000-0000-4000-8000-000000000001",
    "mjsrc_submissionid": "20000000-0000-4000-8000-000000000001",
    "mjsrc_attendeeemail": "participant@example.com",
    "mjsrc_emailconsent": True,
    "mjsrc_submittedat": "2026-09-23T01:02:03Z",
    "mjsrc_retentionexpiresat": "2028-09-23T01:02:03Z",
    "mjsrc_locale": "zh-TW",
    "mjsrc_overall": 5,
    "mjsrc_effort": 2,
    "mjsrc_recommend": 4,
    "mjsrc_comments": "Useful workshop",
    "mjsrc_completionpercent": 60,
    "mjsrc_completedsteps": 3,
    "mjsrc_totalsteps": 5,
    "mjsrc_labstatusjson": json.dumps(LAB_STATUS),
}

normalized = normalize_response(record)
assert normalized["attendeeEmail"] == "participant@example.com"
assert normalized["locale"] == "zh-TW"
assert normalized["overall"] == 5
assert normalized["completionPercent"] == 60
assert normalized["labStatus"] == LAB_STATUS

record["mjsrc_emailconsent"] = False
normalized_without_consent = normalize_response(record)
assert normalized_without_consent["attendeeEmail"] == ""
assert normalized_without_consent["emailConsent"] is False

assert parse_lab_status("not json") == []
assert parse_lab_status(json.dumps({"labId": "lab-01"})) == []
assert parse_lab_status(json.dumps([{"labId": "lab-01"}])) == []


class FakeRecords:
    def list(self, table, select, filter):
        assert table == query_workshop_feedback.SURVEY_TABLE
        assert select == query_workshop_feedback.SELECT_COLUMNS
        assert filter == "mjsrc_workshopkey eq 'workshop:30000000-0000-4000-8000-000000000001'"
        return [record]


class FakeClient:
    records = FakeRecords()


original_get_client = query_workshop_feedback.get_client
try:
    query_workshop_feedback.get_client = lambda skill: FakeClient()
    queried = query_workshop_feedback.query_feedback(
        "30000000-0000-4000-8000-000000000001"
    )
    assert len(queried) == 1
    assert queried[0]["submissionId"] == record["mjsrc_submissionid"]
finally:
    query_workshop_feedback.get_client = original_get_client

print("PASS: feedback dashboard normalization")
